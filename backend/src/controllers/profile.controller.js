import User from "../models/user.model.js";
import { validateUpdateProfile } from "../validation/profile.validation.js";

/**
 * Get : Method
 * Common Function
 * Get Profile data of users
 */
export const getProfile = async (req, res) => {
  try {
    const authUser = req.user; // from authenticate middleware

    // Fetch the latest user data
    const user = await User.findById(authUser.id)
      .select("-password -social_token") // hide sensitive fields
      .populate([
        { path: "university", select: "name" }, // optional, only if you have this relation
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
          studentUniId: user.studentUniId || null,
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "admin":
        // Example: add some admin dashboard stats here if needed
        roleData = {
          phoneNumber: user.phoneNumber || null,
        };
        break;

      case "super_admin":
        // Example: super admin–specific data
        roleData = {
          message: "Super admin access granted",
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
export const updateProfile = async (req, res) => {
  try {
    const authUser = req.user; // from authenticate middleware
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
    // If you have Joi or similar validator:
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

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        university: user.university || null,
        studentUniId: user.studentUniId || null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};