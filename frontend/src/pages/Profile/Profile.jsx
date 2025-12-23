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
import {
  changeStudentPassword,
  fetchProfile,
  updateStudentProfile,
} from "../../features/studentDataSlice";
import { useNavigate } from "react-router-dom";
import { getColleges } from "../../features/studentSlice";
import { changeAdminPassword, getAdminProfile, updateAdminProfile } from "../../features/adminSlice";
import { changeVendorPassword, getVendorProfile, updateProfileByVendor } from "../../features/venderSlice";

const ProfileSkeleton = () => {
  return (
    <div className="bg-[#F5F5F5] lg:mt-14 lg:ml-58 p-6 min-h-screen mx-auto font-[Inter]">
      <div className="w-full bg-white max-w-4xl rounded-2xl shadow-sm p-6 animate-pulse">
        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-200 mb-6 gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-[160px_1fr] gap-8 items-start">
          {/* Image Skeleton */}
          <div className="flex flex-col items-center w-40">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mt-3"></div>
            <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
              </div>
            ))}

            {/* Button Skeleton */}
            <div className="flex justify-end mt-6 md:col-span-2">
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { profile, loading } = useSelector((state) => state.superadmin);
  const { studentProfile, isLoading } = useSelector(
    (state) => state.studentData
  );
  const { adminProfile, isAdminLoading, isAdminSuccess } = useSelector(
    (state) => state.admin
  );
  const {vendorProfile} = useSelector((state)=> state.vendor);
  const { colleges } = useSelector((state) => state.auth);
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
    phoneNumber: "",
    universityId: "",
    universityName: "",
    collegeId: "",
    collegeName: "",
    studentId: "",
    colleges: [],
    selectedColleges: [],
  });

  const [initialProfile, setInitialProfile] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // Security form state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  const Loading = role === "super_admin" ? loading : isLoading;

  useEffect(() => {
    if (role == "super_admin") {
      dispatch(fetchSuperAdminProfile());
    }
    if (role == "student") {
      dispatch(fetchProfile());
    }
    if (role == "admin") {
      dispatch(getAdminProfile());
    }
    if(role == "vendor"){
      dispatch(getVendorProfile());
    }
  }, [dispatch, role]);

  useEffect(() => {
    // SUPER ADMIN PROFILE
    if (role === "super_admin" && profile) {
      const loaded = {
        fullName: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      };

      setFormData((prev) => ({ ...prev, ...loaded }));
      setInitialProfile(loaded);
      setImagePreview(profile.profileImage || null);
    }
    // STUDENT PROFILE
    if (role === "student" && studentProfile) {
      const loaded = {
        fullName: studentProfile.name || "",
        email: studentProfile.email || "",
        phoneNumber: studentProfile.phoneNumber || "",
        universityId:
          studentProfile.university?._id || studentProfile.university || "",
        universityName:
          studentProfile.university?.name ||
          studentProfile.university_name ||
          "",
        collegeId: studentProfile.college?._id || studentProfile.college || "",

        collegeName:
          studentProfile.college?.name || studentProfile.college_name || "",

        studentId: studentProfile.studentUniId || "",
      };
      setFormData((prev) => ({ ...prev, ...loaded }));
      setInitialProfile(loaded);
      setImagePreview(studentProfile.profileImage || null);
    }

    // admin profile
    if (role === "admin" && adminProfile) {
      const loaded = {
        fullName: adminProfile.name || "",
        email: adminProfile.email || "",
        phoneNumber: adminProfile.phoneNumber || "",
        universityId:
          adminProfile.university?._id || adminProfile.university || "",
        universityName:
          adminProfile.university?.name || adminProfile.university_name || "",
        colleges: adminProfile.colleges || [],
        selectedColleges: adminProfile.colleges?.map((c) => c._id) || [],
      };
      setFormData((prev) => ({ ...prev, ...loaded }));
      setInitialProfile(loaded);
      setImagePreview(adminProfile.profileImage || null);
    }

    // vendor profile
    if(role === "vendor" && vendorProfile){
       const loaded = {
        fullName: vendorProfile.name || "",
        email: vendorProfile.email || "",
        phoneNumber: vendorProfile.phoneNumber || "",
        universityId:
          vendorProfile.university?._id || vendorProfile.university || "",
        universityName:
          vendorProfile.university?.name || vendorProfile.university_name || "",
        colleges: vendorProfile.colleges || [],
      };
      setFormData((prev) => ({ ...prev, ...loaded }));
      setInitialProfile(loaded);
      setImagePreview(vendorProfile.profileImage || null);
    }
  }, [role, profile, studentProfile, adminProfile, vendorProfile]);

  useEffect(() => {
    if (role === "student" && studentProfile?.university?._id) {
      dispatch(getColleges(studentProfile.university._id));
    }
    if (role === "admin" && adminProfile?.university?._id) {
      dispatch(getColleges(adminProfile.university._id));
    }
  }, [role, studentProfile?.university?._id, adminProfile?.university?._id]);

  const hasChanges = () => {
    if (!initialProfile) return true;

    let fieldsToCheck = ["fullName", "phoneNumber", "collegeId"];

     if (role === "vendor") {
    fieldsToCheck = ["fullName", "phoneNumber"];
  }

    // Check if any formData field differs from initialProfile
    const basicChanged = fieldsToCheck.some(
      (field) => formData[field] !== initialProfile[field]
    );

    // Image changed?
    const imageChanged = profileImage !== null;

    return basicChanged || imageChanged;
  };

  const handlePhoneFormat = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    // Remove "04" if user typed it
    if (value.startsWith("04")) {
      value = value.slice(2);
    }

    // Limit to 8 digits (after "04")
    value = value.slice(0, 8);

    // Format as "04XX XXX XXX"
    let formatted = "04";
    if (value.length > 0) {
      if (value.length <= 2) {
        formatted += value;
      } else if (value.length <= 5) {
        formatted += value.slice(0, 2) + " " + value.slice(2);
      } else {
        formatted +=
          value.slice(0, 2) + " " + value.slice(2, 5) + " " + value.slice(5);
      }
    }

    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        showToast("Name must contain letters only!", "error");
        return; // stop update
      }
    }

    if (name === "phoneNumber") {
      if (!/^[0-9]*$/.test(value)) {
        showToast("Phone number must contain digits only!", "error");
        return;
      }
    }

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

    const allowedType = ["image/jpeg", "image/png"];
    if (!allowedType.includes(file.type)) {
      showToast("Only PNG or JPG files are allowed", "error");
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

      showToast("Image Added. Please click Save to complete the process.");
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

    const cleanedPhone = formData.phoneNumber.replace(/\s/g, "");

    if (!/^04\d{8}$/.test(cleanedPhone)) {
      showToast("Phone number must be in format: 04XX XXX XXX", "error");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    if (role === "student") {
      if (formData.collegeId) {
        formDataToSend.append("college", formData.collegeId);
      }
    }

    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    if (role === "super_admin") {
      dispatch(updateSuperAdminProfile(formDataToSend))
        .unwrap()
        .then((updatedUser) => {
          showToast("Profile updated successfully!", "success");
          const updated = {
            fullName: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
          };
          setInitialProfile(updated);
          setProfileImage(null);
        })
        .catch((err) => {
          showToast("Failed to update profile!", "error");
          console.error(err);
        });
    }

    if (role === "student") {
      dispatch(updateStudentProfile(formDataToSend))
        .unwrap()
        .then((updatedUser) => {
          showToast("Profile updated successfully!", "success");
          const updated = {
            fullName: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
            collegeId: updatedUser.college,
          };

          setInitialProfile(updated);
          setProfileImage(null);
          //  dispatch(fetchProfile());
        })
        .catch((err) => {
          showToast("Failed to update profile!", "error");
          console.error(err);
        });
    }
    if (role === "admin") {
      const collegesString = formData.selectedColleges.join(",");

      formDataToSend.append("colleges", collegesString);

      dispatch(updateAdminProfile(formDataToSend))
        .unwrap()
        .then((updatedUser) => {
          showToast("Profile updated successfully!", "success");

          const updatedColleges =
            updatedUser.colleges?.map((id, i) => ({
              _id: id,
              name: updatedUser.colleges_names?.[i],
            })) || [];

          setFormData((prev) => ({
            ...prev,
            colleges: updatedColleges,
            selectedColleges: updatedColleges.map((c) => c._id),
          }));

          setInitialProfile({
            fullName: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
          });

          setProfileImage(null);
        })
        .catch(() => {
          showToast("Failed to update profile", "error");
        });
    }

     if (role === "vendor") {
      dispatch(updateProfileByVendor(formDataToSend))
        .unwrap()
        .then((updatedUser) => {
          showToast("Profile updated successfully!", "success");
          const updated = {
            fullName: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
          };
          setInitialProfile(updated);
          setProfileImage(null);
          dispatch(getVendorProfile());
        })
        .catch((err) => {
          showToast("Failed to update profile!", "error");
          console.error(err);
        });
    }
  };

  const handlePassChange = async () => {
  const { currentPassword, newPassword, confirmPassword } = securityData;
  const errors = {};

  // Empty field validation
  if (!currentPassword.trim()) errors.currentPassword = true;
  if (!newPassword.trim()) errors.newPassword = true;
  if (!confirmPassword.trim()) errors.confirmPassword = true;

  setPasswordErrors(errors);

  if (Object.keys(errors).length > 0) {
    showToast("Please fill all password fields!", "error");
    return;
  }

  // New password must be at least 6 characters
  if (newPassword.length < 6) {
    showToast("New password must be at least 6 characters long!", "error");
    setPasswordErrors((prev) => ({ ...prev, newPassword: true }));
    return;
  }

  // Password match validation
  if (newPassword !== confirmPassword) {
    showToast("New passwords do not match!", "error");
    setPasswordErrors({
      newPassword: true,
      confirmPassword: true,
    });
    return;
  }

  try {
    let action;

    if (role === "super_admin") {
      action = changeSuperAdminPassword({ currentPassword, newPassword });
    } else if (role === "student") {
      action = changeStudentPassword({ currentPassword, newPassword });
    } else if (role === "admin") {
      action = changeAdminPassword({ currentPassword, newPassword });
    } else if (role === "vendor"){
      action = changeVendorPassword({ currentPassword, newPassword});
    }

    // If no valid role
    if (!action) {
      showToast("Invalid user role!", "error");
      return;
    }

    await dispatch(action).unwrap();
    showToast("Password changed successfully!", "success");

    // Reset form
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

    // Hide toggles
    setShowCurrentPass(false);
    setShowNewPass(false);
    setShowConfirmPass(false);

    // Switch back to profile tab
    setActiveTab("profile");
  } catch (err) {
    showToast(err || "Failed to change password!", "error");
  }
};

  return (
    <>
      {Loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-[#F5F5F5] mt-10 lg:mt-14 lg:ml-58 p-6 min-h-screen mx-auto font-[Inter]">
          <div className="w-full bg-white max-w-4xl rounded-2xl shadow-sm p-6">
            {/* --- Section 1: Tabs --- */}
            <div className="flex border-b border-gray-200 mb-6">
              <div className=" text-indigo-800">
                <button
                  onClick={() => navigate(-1)}
                  className="px-2 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-2 px-4 text-sm cursor-pointer font-medium transition ${
                  activeTab === "profile"
                    ? "text-[#5D3F87] border-b-2 border-[#5D3F87]"
                    : "text-[#718EBF] hover:scale-[1.08]"
                }`}
              >
                Edit Profile
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`pb-2 px-4 text-sm font-medium cursor-pointer transition ${
                  activeTab === "security"
                    ? "text-[#5D3F87] border-b-2 border-[#5D3F87]"
                    : "text-[#718EBF] hover:scale-[1.08]"
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
                  className="md:grid md:grid-cols-[160px_1fr] gap-8 items-start"
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
                  <div className="flex flex-col mx-auto md:mx-0 items-center w-40">
                    <div className="relative">
                      <img
                        src={
                          imagePreview ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        // alt={profile?.firstName || "Profile"}
                        className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
                      />

                      <label
                        htmlFor="imageUpload"
                        className="absolute bottom-1 right-1 bg-[#6558A1] hover:bg-[#7A6CCF] cursor-pointer transition transform hover:scale-[1.05] duration-150 text-white p-2 rounded-full shadow-md text-xs"
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
                    <p className="text-[11px] text-gray-400 text-center mt-1 leading-tight">
                      Only{" "}
                      <span className="text-[#6558A1] font-medium">
                        JPG / PNG
                      </span>{" "}
                      files
                      <br />
                      Max size:{" "}
                      <span className="text-[#6558A1] font-medium">5MB</span>
                    </p>
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
                        autoComplete="off"
                        placeholder="Enter email"
                        className="w-full border border-gray-200 bg-gray-100  text-gray-500 rounded-xl focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-sm">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        maxLength={15}
                        value={formData.phoneNumber}
                        onChange={handlePhoneFormat}
                        placeholder="0405 150 817"
                        className="w-full border border-gray-200 rounded-xl text-[#718EBF] focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                      />
                    </div>

                    {/* University */}

                    {role !== "super_admin" && (
                      <div>
                        <label className="text-sm">University</label>
                        <input
                          type="text"
                          name="university"
                          value={formData.universityName}
                          disabled
                          className="w-full border border-gray-200 rounded-xl bg-gray-100  text-gray-500 focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                        />
                      </div>
                    )}

                    {/* {role === "admin" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Colleges
                        </label>

                        <div
                          className="w-full min-h-[44px] border border-gray-200 rounded-xl
      flex flex-wrap items-center gap-2 px-3 py-2 bg-white"
                        >
                          {formData.colleges.length === 0 && (
                            <span className="text-sm text-gray-400">
                              Select colleges
                            </span>
                          )}

                          {formData.colleges.map((college) => (
                            <span
                              key={college._id}
                              className="flex items-center gap-1 bg-[#EDE9FE]
            text-[#5D3F87] text-xs px-2 py-1 rounded-full"
                            >
                              {college.name}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => {
                                    const updatedIds =
                                      prev.selectedColleges.filter(
                                        (id) => id !== college._id
                                      );

                                    return {
                                      ...prev,
                                      selectedColleges: updatedIds,
                                      colleges: prev.colleges.filter(
                                        (c) => c._id !== college._id
                                      ),
                                    };
                                  });
                                }}
                                className="text-[#5D3F87] disabled cursor-pointer hover:text-red-500 font-bold"
                              >
                                × 
                              </button>
                            </span>
                          ))}
                        </div>

                        <select
                          className="w-full mt-2 border border-gray-200 rounded-xl
        text-[#718EBF] px-3 py-2.5 text-sm
        focus:ring-1 focus:ring-[#DFEAF2] outline-none"
                          value=""
                          disabled={!formData.universityId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            if (!selectedId) return;

                            const selectedCollege = colleges.find(
                              (c) => c._id === selectedId
                            );

                            if (!selectedCollege) return;

                            setFormData((prev) => {
                              if (prev.selectedColleges.includes(selectedId))
                                return prev;

                              return {
                                ...prev,
                                selectedColleges: [
                                  ...prev.selectedColleges,
                                  selectedId,
                                ],
                                colleges: [...prev.colleges, selectedCollege],
                              };
                            });
                          }}
                        >
                          <option value="">Select a college</option>

                          {colleges.map((college) => (
                            <option
                              key={college._id}
                              value={college._id}
                              disabled={formData.selectedColleges.includes(
                                college._id
                              )}
                            >
                              {college.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )} */}

                    {role == "student" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          College
                        </label>

                        <div className="relative">
                          <select
                            name="collegeId"
                            value={formData.collegeId || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                collegeId: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-200 rounded-xl text-[#718EBF] appearance-none focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                          >
                            {formData.universityId && colleges.length === 0 && (
                              <option value="">
                                No colleges found for this university
                              </option>
                            )}

                            {formData.universityId && colleges.length > 0 && (
                              <>
                                <option value="">Select your college</option>
                                {colleges.map((c) => (
                                  <option key={c._id} value={c._id}>
                                    {c.name}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                          {/* Custom Dropdown Arrow */}
                          <svg
                            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {role == "student" && (
                      <div>
                        <label className="text-sm">Student Id</label>
                        <input
                          type="text"
                          name="studentId"
                          disabled
                          value={formData.studentId}
                          placeholder="Student ID"
                          className="w-full border border-gray-200 rounded-xl bg-gray-100  text-gray-500 focus:ring-1 focus:ring-[#DFEAF2] outline-none px-3 py-2.5 mt-1 text-sm"
                        />
                      </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end mt-6 md:col-span-2">
                      <button
                        onClick={handleSave}
                        type="button"
                        disabled={Loading}
                        className={`${
                          Loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#6558A1] hover:bg-[#7A6CCF] cursor-pointer transition transform hover:scale-[1.05] duration-150"
                        } text-white text-xs font-semibold rounded-xl px-16 py-2.5 transition`}
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
                      className=" text-white text-xs rounded-xl px-16 py-2.5 bg-[#6558A1] hover:bg-[#7A6CCF] cursor-pointer transition transform hover:scale-[1.03] duration-150"
                    >
                      {loading ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
