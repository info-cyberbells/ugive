import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeSuperAdminPassword,
  fetchSuperAdminProfile,
  updateSuperAdminProfile,
} from "../../features/superadminProfileSlice";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import imageCompression from "browser-image-compression";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { profile, loading } = useSelector((state) => state.superadmin);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // 🧠 Profile form state (all empty)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dob: "",
    municipality: "",
    license: "",
    phoneNumber: "",
    city: "",
    validUntil: "",
    country: "",
  });

  const [initialProfile, setInitialProfile] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Security form state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(fetchSuperAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const loaded = {
        fullName: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      };

      setFormData(loaded);
      setInitialProfile(loaded); 
      setImagePreview(profile.profileImage || null);
    }
  }, [profile]);

  const hasChanges = () => {
    if (!initialProfile) return true;

    const basicChanged =
      formData.fullName !== initialProfile.fullName ||
      formData.phoneNumber !== initialProfile.phoneNumber;

    const imageChanged = profileImage !== null;

    return basicChanged || imageChanged;
  };

  // Handle profile input
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle security input
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB", "error");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const fileWithName = new File(
        [compressedFile],
        file.name || `avatar-${Date.now()}.jpg`,
        { type: compressedFile.type }
      );

      setProfileImage(fileWithName);
      setImagePreview(URL.createObjectURL(compressedFile));

      showToast("Image uploaded successfully", "success");
    } catch (error) {
      console.error("Error compressing image:", error);
      showToast("Error processing image. Please try another one.", "error");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!hasChanges()) {
      showToast("No changes detected!", "info");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    dispatch(updateSuperAdminProfile(formDataToSend))
      .unwrap()
      .then((updatedUser) => {
        showToast("Profile updated successfully!", "success");
        const updated = {
          fullName: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
        };

        setInitialProfile(updated);
        setProfileImage(null);
      })

      .catch((err) => {
        showToast("Failed to update profile!", "error");
        console.error(err);
      });
  };

  const handlePassChange = () => {
    const { currentPassword, newPassword, confirmPassword } = securityData;
    const errors = {};

    if (!currentPassword.trim()) errors.currentPassword = true;
    if (!newPassword.trim()) errors.newPassword = true;
    if (!confirmPassword.trim()) errors.confirmPassword = true;

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("Please fill all password fields!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match!", "error");
      setPasswordErrors({
        newPassword: true,
        confirmPassword: true,
      });
      return;
    }

    dispatch(changeSuperAdminPassword({ currentPassword, newPassword }))
  .unwrap()
  .then(() => {
    showToast("Password changed successfully!", "success");

    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);
    setActiveTab("profile");
  })
  .catch((err) => {
    showToast(err || "Failed to change password!", "error");
  });

  };

  return (
    <div className="bg-[#F5F5F5] lg:mt-14 lg:ml-58 p-6 min-h-screen mx-auto font-[Inter]">
      <div className="w-full bg-white max-w-4xl rounded-2xl shadow-sm p-6">
        {/* --- Section 1: Tabs --- */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-2 px-4 text-sm cursor-pointer font-medium transition ${
              activeTab === "profile"
                ? "text-[#3565E3] border-b-2 border-blue-600"
                : "text-[#718EBF]"
            }`}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-2 px-4 text-sm font-medium cursor-pointer transition ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-[#718EBF]"
            }`}
          >
            Security
          </button>
        </div>

        {/*Section 2:*/}
        <div>
          {activeTab === "profile" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="grid grid-cols-[160px_1fr] gap-8 items-start"
              autoComplete="off"
            >
              <input
                type="text"
                name="fakeuser"
                autoComplete="username"
                className="hidden"
              />
              <input
                type="password"
                name="fakepass"
                autoComplete="new-password"
                className="hidden"
              />

              {/*  Image Upload Section */}
              <div className="flex flex-col items-center w-40">
                <div className="relative">
                  <img
                    src={
                      imagePreview ||
                      //   profile?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    // alt={profile?.firstName || "Profile"}
                    className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
                  />

                  <label
                    htmlFor="imageUpload"
                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white p-2 rounded-full shadow-md text-xs"
                  >
                    ✎
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">Change Photo</p>
              </div>

              {/* Form Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Full Name */}
                <div>
                  <label className="text-sm">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Full Name"
                    className="w-full border text-[#718EBF] border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:ring-1 focus:ring-[#DFEAF2] outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    onChange={handleProfileChange}
                    autoComplete="off"
                    placeholder="Enter email"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-sm">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                  />
                </div>

                {/* Date of Birth */}
                {/* <div>
                                    <label className="text-sm">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleProfileChange}
                                        className={`w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm ${!formData.dob ? "text-gray-400" : "text-black"
                                            }`}
                                        placeholder="Select date"
                                    />
                                </div> */}

                {/* Municipality */}
                {/* <div>
                                    <label className="text-sm">Municipality</label>
                                    <input
                                        type="text"
                                        name="municipality"
                                        value={formData.municipality}
                                        onChange={handleProfileChange}
                                        placeholder="Enter municipality"
                                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                                    />
                                </div> */}

                {/* License Number */}
                {/* <div>
                                    <label className="text-sm">Driving License Number</label>
                                    <input
                                        type="text"
                                        name="license"
                                        value={formData.license}
                                        onChange={handleProfileChange}
                                        placeholder="Enter license number"
                                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                                    />
                                </div> */}

                {/* City */}
                {/* <div>
                                    <label className="text-sm">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleProfileChange}
                                        placeholder="Enter city"
                                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                                    />
                                </div> */}

                {/* Valid Until */}
                {/* <div>
                                    <label className="text-sm">Valid Until</label>
                                    <input
                                        type="text"
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleProfileChange}
                                        placeholder="Enter expiry date"
                                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                                    />
                                </div> */}

                {/* Country */}
                {/* <div>
                                    <label className="text-sm">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleProfileChange}
                                        placeholder="Enter country"
                                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                                    />
                                </div> */}

                {/* Save Button */}
                <div className="flex justify-end mt-6 md:col-span-2">
                  <button
                    onClick={handleSave}
                    type="button"
                    disabled={loading}
                    className={`${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#3565E3] cursor-pointer hover:bg-blue-700"
                    } text-white text-xs rounded-xl px-16 py-2.5 transition`}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Security Tab
            <div className="max-w-md">
              <h4 className="font-semibold text-gray-700 mb-4">
                Change Password
              </h4>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-sm">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter current password"
                      autoComplete="new-password"
                      className={`w-full border rounded-xl px-3 py-2.5 pr-10 mt-1 text-sm focus:ring-1 outline-none ${
                        passwordErrors.currentPassword
                          ? "border-red-500 bg-red-50 focus:ring-red-300"
                          : "border-gray-200 focus:ring-[#DFEAF2]"
                      } text-[#718EBF]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPass ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter new password"
                      className={`w-full border rounded-xl px-3 py-2.5 pr-10 mt-1 text-sm focus:ring-1 outline-none ${
                        passwordErrors.newPassword
                          ? "border-red-500 bg-red-50 focus:ring-red-300"
                          : "border-gray-200 focus:ring-[#DFEAF2]"
                      } text-[#718EBF]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPass ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      placeholder="Re-enter new password"
                      className={`w-full border rounded-xl px-3 py-2.5 pr-10 mt-1 text-sm focus:ring-1 outline-none ${
                        passwordErrors.confirmPassword
                          ? "border-red-500 bg-red-50 focus:ring-red-300"
                          : "border-gray-200 focus:ring-[#DFEAF2]"
                      } text-[#718EBF]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPass ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-12">
                <button
                  onClick={handlePassChange}
                  className="bg-[#3565E3] text-white text-xs rounded-xl px-16 py-2.5 cursor-pointer hover:bg-blue-700 transition"
                >
                  {loading ? "Updating..." : "Change Password"} 
                 
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
