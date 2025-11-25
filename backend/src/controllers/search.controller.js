import User from "../models/user.model.js";
import College from "../models/college.model.js";
import University from "../models/university.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import mongoose from "mongoose";

/**
 * GET /api/search
 * query params:
 *   name      -> partial name search
 *   college   -> collegeId (ObjectId)
 *   university-> universityId (ObjectId)
 *   page      -> page number (default 1)
 *   limit     -> page size (default 20)
 */
export const searchStudents = async (req, res) => {
    try {
        const authUser = req.user;
        if (!authUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { name, college, university, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));

        // Only students should be returned
        const filters = { role: "student" };

        // Exclude current user
        filters._id = { $ne: new mongoose.Types.ObjectId(authUser.id) };

        // Search by name
        if (name) {
            const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filters.name = { $regex: safe, $options: "i" };
        }

        // Search by College Name
        if (college) {
            const collegeDocs = await College.find({
                name: { $regex: college, $options: "i" },
            });

            if (collegeDocs.length > 0) {
                const collegeIds = collegeDocs.map(c => c._id);
                filters.college = { $in: collegeIds };
            } else {
                return res.status(200).json({ success: true, total: 0, results: [] });
            }
        }

        // Search by University Name
        if (university) {
            const uniDocs = await University.find({
                name: { $regex: university, $options: "i" },
            });

            if (uniDocs.length > 0) {
                const uniIds = uniDocs.map(u => u._id);
                filters.university = { $in: uniIds };
            } else {
                return res.status(200).json({ success: true, total: 0, results: [] });
            }
        }

        // Count
        const total = await User.countDocuments(filters);

        // Fetch Results
        const users = await User.find(filters)
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

        // Friend Request Mapping
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
