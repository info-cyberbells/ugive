import FriendRequest from "../models/friendRequest.model.js";


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
    console.log('requestId',requestId);
    console.log('userId',userId);

    const reqDoc = await FriendRequest.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending"
    });

    console.log('reqDoc',reqDoc);

    if (!reqDoc) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    reqDoc.status = "accepted";
    await reqDoc.save();

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

    const list = await FriendRequest.find({
      sender: userId,
      status: "pending"
    }).populate("receiver", "name profileImage");

    return res.status(200).json({ success: true, results: list });

  } catch (err) {
    console.error("Sent list error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const list = await FriendRequest.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "name profileImage");

    return res.status(200).json({ success: true, results: list });

  } catch (err) {
    console.error("Receive list error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));

    // Get accepted relationships where user is sender OR receiver
    const connections = await FriendRequest.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name profileImage college university")
      .populate("receiver", "name profileImage college university")
      .lean();

    if (!connections || connections.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        page: pageNum,
        limit: pageSize,
        results: []
      });
    }

    // Build list of actual friends
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const friends = connections.map(c => {
      const friend = c.sender._id.toString() === userId.toString()
        ? c.receiver
        : c.sender;

      return {
        id: friend._id,
        name: friend.name,
        profileImage: friend.profileImage ? `${baseURL}${friend.profileImage}` : null,
        college: friend.college || null,
        university: friend.university || null,
        connectedAt: c.updatedAt
      };
    });

    // Pagination
    const total = friends.length;
    const start = (pageNum - 1) * pageSize;
    const paginated = friends.slice(start, start + pageSize);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: pageSize,
      results: paginated
    });

  } catch (err) {
    console.error("Get friends error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
