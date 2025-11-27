import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { validateUpdateProfile } from "../validation/profile.validation.js";

/**
 * Get : Method
 * Common Function
 * Get Profile data of users
 */
export const getProfileOLD = async (req, res) => {
  try {
    const authUser = req.user; // from authenticate middleware

    // Fetch the latest user data
    const user = await User.findById(authUser.id)
      .select("-password -social_token") // hide sensitive fields
      .populate([
        { path: "university", select: "name" },
        { path: "college", select: "name" }
      ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Single role (string)
    const role = user.role?.toLowerCase();

    let roleData = {};

    // Role-specific data handling
    switch (role) {
      case "student":
        roleData = {
          university: user.university || null,
          college: user.college || null,
          studentUniId: user.studentUniId || null,
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "admin":
        roleData = {
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "super_admin":
        roleData = {
          phoneNumber: user.phoneNumber || null,
          profileImage: user.profileImage
            ? `${baseURL}${user.profileImage}`
            : null,
        };
        break;

      default:
        roleData = {
          message: "Standard user profile",
        };
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...roleData,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const authUser = req.user;

    const user = await User.findById(authUser.id)
      .select("-password -social_token")
      .populate([
        { path: "university", select: "name" },
        { path: "college", select: "name" }
      ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = user.role?.toLowerCase();

    // Base URL (API host)
    const baseURL = `${req.protocol}://${req.get("host")}`;

    let roleData = {};

    switch (role) {
      case "student":
        roleData = {
          university: user.university || null,
          college: user.college || null,
          studentUniId: user.studentUniId || null,
          phoneNumber: user.phoneNumber || null,
          profileImage: user.profileImage
            ? `${baseURL}${user.profileImage}`
            : null,
        };
        break;

      case "admin":
        roleData = {
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "super_admin":
        roleData = {
          phoneNumber: user.phoneNumber || null,
          profileImage: user.profileImage
            ? `${baseURL}${user.profileImage}`
            : null,
        };
        break;

      default:
        roleData = {
          message: "Standard user profile",
        };
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...roleData,
      },
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/**
 * PUT : Method
 * Common Function
 * Update Profile data of users
 */
export const updateProfileOLD = async (req, res) => {
  try {
    const authUser = req.user;
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const role = user.role?.toLowerCase();
    const data = req.body;

    // Validate fields
    const { error } = validateUpdateProfile(data, role);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // ⬇️ Add profileImage if uploaded
    if (req.file) {
      const imagePath = `/uploads/profile-images/${req.file.filename}`;
      user.profileImage = imagePath;
    }

    // Role-based updates
    switch (role) {
      case "student":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.university) user.university = data.university;
        if (data.college) user.college = data.college;
        if (data.studentUniId) user.studentUniId = data.studentUniId;
        break;

      case "admin":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.university) user.university = data.university;
        break;

      case "super_admin":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        break;
    }

    await user.save();

    const populatedUser = await User.findById(user._id)
      .populate("university", "name")
      .populate("college", "name");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        phoneNumber: populatedUser.phoneNumber,
        profileImage: populatedUser.profileImage ? `${req.protocol}://${req.get("host")}${populatedUser.profileImage}` : null,
        university: populatedUser.university?._id || null,
        university_name: populatedUser.university?.name || null,
        college: populatedUser.college?._id || null,
        college_name: populatedUser.college?.name || null,
        studentUniId: populatedUser.studentUniId || null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const authUser = req.user;
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = user.role?.toLowerCase();
    const data = req.body;

    // --- Validation section ---
    const { error } = validateUpdateProfile(data, role);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details ? error.details[0].message : error.message,
      });
    }

    // --- Update logic per role ---
    switch (role) {
      case "student":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.university) user.university = data.university;
        if (data.college) user.college = data.college;
        if (data.studentUniId) user.studentUniId = data.studentUniId;
        break;

      case "admin":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.university) user.university = data.university;
        break;

      case "super_admin":
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        break;

      default:
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this profile.",
        });
    }

    if (data.password && data.password.trim() !== "") {
      user.password = data.password;
    }

    if (req.file) {
      user.profileImage = `/uploads/profile-images/${req.file.filename}`;
    }

    await user.save();
    const populatedUser = await User.findById(user._id).select("-password").populate("university", "name").populate("college", "name");

    let responseUser = {
      id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      phoneNumber: populatedUser.phoneNumber,
      profileImage: populatedUser.profileImage
        ? `${req.protocol}://${req.get("host")}${populatedUser.profileImage}`
        : null,
    };

    if (role === "student") {
      responseUser = {
        ...responseUser,
        university: populatedUser.university?._id || null,
        university_name: populatedUser.university?.name || null,
        college: populatedUser.college?._id || null,
        college_name: populatedUser.college?.name || null,
        studentUniId: populatedUser.studentUniId || null,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: responseUser,
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
