import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import mongoose from "mongoose";
import collegeModel from "../models/college.model.js";
import universityModel from "../models/university.model.js";

/**
 * GET /api/search
 * query params:
 *   name      -> partial name/email search
 *   page      -> page number (default 1)
 *   limit     -> page size (default 20)
 */
export const searchStudents = async (req, res) => {
    try {
        const authUser = req.user;
        if (!authUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { name, university, college,page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));

        const conditions = [
            { role: "student" },
            { _id: { $ne: new mongoose.Types.ObjectId(authUser.id) } },
            {
                $or: [
                    { isDeleted: { $exists: false } },
                    { isDeleted: false }
                ]
            }
        ];

        // Search by name OR email
        if (name && name.trim()) {
            const safe = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            conditions.push({
                $or: [
                    { name: { $regex: safe, $options: "i" } },
                    { email: { $regex: safe, $options: "i" } }
                ]
            });
        }

       // Search by university name (optional)
        if (university && university.trim()) {
            const safeUniversity = university
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const universities = await universityModel.find({
                name: { $regex: safeUniversity, $options: "i" }
            }).select("_id");

            if (!universities.length) {
                return res.status(200).json({
                    success: true,
                    total: 0,
                    page: pageNum,
                    limit: pageSize,
                    results: []
                });
            }

            const universityIds = universities.map(u => u._id);

            // Always filter by university
            conditions.push({
                university: { $in: universityIds }
            });

            // If college is NOT provided → only students WITHOUT college
            if (!college || !college.trim()) {
                conditions.push({
                    $or: [
                        { college: { $exists: false } },
                        { college: null }
                    ]
                });
            }
        }



        // Search by college name (optional)
        if (college && college.trim()) {
            const safeCollege = college.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const colleges = await collegeModel.find({
                name: { $regex: safeCollege, $options: "i" }
            }).select("_id");

            if (colleges.length) {
                conditions.push({
                    college: { $in: colleges.map(c => c._id) }
                });
            } else {
                // No college matched → no results
                return res.status(200).json({
                    success: true,
                    total: 0,
                    page: pageNum,
                    limit: pageSize,
                    results: []
                });
            }
        }


        const query = { $and: conditions };

        // Count
        const total = await User.countDocuments(query);

        // Fetch Results
        const users = await User.find(query)
            .select("name email profileImage university college")
            .populate({ path: "university", select: "name" })
            .populate({ path: "college", select: "name" })
            .sort({ name: 1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .lean();

        if (!users.length) {
            return res.status(200).json({ success: true, total, results: [] });
        }

        const resultUserIds = users.map(u => new mongoose.Types.ObjectId(u._id));

        const requests = await FriendRequest.find({
            $or: [
                { sender: authUser.id, receiver: { $in: resultUserIds } },
                { receiver: authUser.id, sender: { $in: resultUserIds } }
            ],
        }).lean();

        const statusMap = {};
        for (const r of requests) {
            const otherId =
                r.sender.toString() === authUser.id.toString()
                    ? r.receiver.toString()
                    : r.sender.toString();

            if (!statusMap[otherId])
                statusMap[otherId] = { requestedByMe: false, requestedToMe: false, connected: false };

            if (r.status === "accepted") {
                statusMap[otherId].connected = true;
            } else if (r.status === "pending") {
                if (r.sender.toString() === authUser.id.toString()) {
                    statusMap[otherId].requestedByMe = true;
                } else {
                    statusMap[otherId].requestedToMe = true;
                }
            }
        }

        const baseURL = `${req.protocol}://${req.get("host")}`;
        const formatted = users.map(u => {
            const uid = u._id.toString();
            const st = statusMap[uid] || {
                requestedByMe: false,
                requestedToMe: false,
                connected: false
            };

            let friendshipStatus = "none";
            if (st.connected) friendshipStatus = "connected";
            else if (st.requestedByMe) friendshipStatus = "requested_by_me";
            else if (st.requestedToMe) friendshipStatus = "requested_to_me";

            return {
                id: uid,
                name: u.name,
                email: u.email,
                university: u.university ? { id: u.university._id, name: u.university.name } : null,
                college: u.college ? { id: u.college._id, name: u.college.name } : null,
                profileImage: u.profileImage ? `${baseURL}${u.profileImage}` : null,
                friendshipStatus,
            };
        });

        return res.status(200).json({
            success: true,
            total,
            page: pageNum,
            limit: pageSize,
            results: formatted,
        });
    } catch (err) {
        console.error("Search error:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};