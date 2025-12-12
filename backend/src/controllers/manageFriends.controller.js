import FriendRequest from "../models/friendRequest.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";



export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId)
      return res.status(400).json({ success: false, message: "Receiver ID required" });

    if (senderId === receiverId)
      return res.status(400).json({ success: false, message: "You cannot send request to yourself" });

    // Check existing request or accepted
    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      // Already friends
      if (existing.status === "accepted") {
        return res.status(400).json({ success: false, message: "Already connected" });
      }

      // If receiver already sent request to sender → auto accept
      if (existing.sender.toString() === receiverId.toString() && existing.status === "pending") {
        existing.status = "accepted";
        await existing.save();
        return res.status(200).json({
          success: true,
          message: "Request auto-accepted",
        });
      }

      // sender already sent pending
      return res.status(400).json({
        success: false,
        message: "Friend request already pending",
      });
    }

    // Create new request
    const newReq = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent",
      data: newReq
    });

  } catch (err) {
    console.error("Send request error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.body;
    console.log('requestId', requestId);
    console.log('userId', userId);

    const reqDoc = await FriendRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending"
    });

    console.log('reqDoc', reqDoc);

    if (!reqDoc) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    reqDoc.status = "accepted";
    await reqDoc.save();

    await NotificationActivity.create({
      type: "notification",
      action: "friend_request_accepted",
      message: `Two users became friends`,
      createdBy: userId,
      meta: { requestId }
    });


    return res.status(200).json({
      success: true,
      message: "Friend request accepted"
    });

  } catch (err) {
    console.error("Accept request error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.body;

    const reqDoc = await FriendRequest.findOne({
      _id: requestId,
      status: "pending",
      $or: [{ sender: userId }, { receiver: userId }]
    });

    if (!reqDoc) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await reqDoc.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend request removed"
    });

  } catch (err) {
    console.error("Delete request error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const unfriendUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    const connection = await FriendRequest.findOne({
      status: "accepted",
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: "No connection found" });
    }

    await connection.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Unfriended successfully",
    });

  } catch (err) {
    console.error("Unfriend error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const baseURL = `${req.protocol}://${req.get("host")}`;

    let list = await FriendRequest.find({
      sender: userId,
      status: "pending"
    }).populate("receiver", "name profileImage email");

    list = list.map((item) => {
      if (item.receiver?.profileImage) {
        item.receiver.profileImage = `${baseURL}${item.receiver.profileImage}`;
      }
      return item;
    });

    return res.status(200).json({ success: true, results: list });

  } catch (err) {
    console.error("Sent list error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const baseURL = `${req.protocol}://${req.get("host")}`;

    let list = await FriendRequest.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "name profileImage email");

    list = list.map((item) => {
      if (item.sender?.profileImage) {
        item.sender.profileImage = `${baseURL}${item.sender.profileImage}`;
      }
      return item;
    });

    return res.status(200).json({ success: true, results: list });

  } catch (err) {
    console.error("Receive list error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { university, college, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, parseInt(limit, 10));

    const connections = await FriendRequest.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate({
        path: "sender",
        select: "name profileImage university college email",
        populate: [
          { path: "university", select: "name" },
          { path: "college", select: "name" }
        ]
      })
      .populate({
        path: "receiver",
        select: "name profileImage university college email",
        populate: [
          { path: "university", select: "name" },
          { path: "college", select: "name" }
        ]
      })
      .lean();

    if (!connections.length) {
      return res.status(200).json({
        success: true,
        total: 0,
        results: [],
      });
    }

    const baseURL = `${req.protocol}://${req.get("host")}`;

    let friends = connections
      .filter((relation) => relation.sender && relation.receiver) // Filter out null users
      .map((relation) => {
        const friendDoc =
          relation.sender._id.toString() === userId
            ? relation.receiver
            : relation.sender;

        return {
          id: friendDoc._id,
          name: friendDoc.name,
          profileImage: friendDoc.profileImage
            ? baseURL + friendDoc.profileImage
            : null,
          university: friendDoc.university,
          college: friendDoc.college,
          email: friendDoc.email,
          connectedAt: relation.updatedAt,
        };
      });


    if (university) {
      friends = friends.filter(
        (f) => f.university && f.university.toString() === university.toString()
      );
    }

    if (college) {
      friends = friends.filter(
        (f) => f.college && f.college.toString() === college.toString()
      );
    }

    // STEP 4: Pagination
    const total = friends.length;
    const start = (pageNum - 1) * pageSize;
    const paginated = friends.slice(start, start + pageSize);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: pageSize,
      results: paginated,
    });

  } catch (err) {
    console.error("Get friends error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

