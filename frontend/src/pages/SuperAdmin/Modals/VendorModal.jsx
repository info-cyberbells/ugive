import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  User,
  School,
  Globe,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../context/ToastContext";
import { getUniversities } from "../../../features/studentSlice";
import imageCompression from "browser-image-compression";

const VendorModal = ({
  isOpen,
  onClose,
  mode = "add",
  initialData = null,
  onSave,
  isLoading = false,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";

  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { universities } = useSelector((state) => state.auth);

  // State Management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profileImage: "",
    profileImageFile: null, 
    university: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        university: "",
        universityName: "",
        profileImageUrl: "", // REAL URL from backend
        profileImageFile: null, // File only
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode === "view") return;

    dispatch(getUniversities())
      .unwrap()
      .catch((err) => {
        showToast(err || "Failed to fetch universities", "error");
      });
  }, [dispatch, showToast, mode, isOpen]);

 const compressImageBelow100KB = async (file) => {
  if (file.size > 1024 * 1024) {
    throw new Error("Please upload image below 1MB");
  }

  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 600,
    initialQuality: 0.6,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);

  if (compressedFile.size > 100 * 1024) {
    throw new Error("Could not compress image below 100KB");
  }

  return compressedFile;
};


  // Helper to format phone number correctly for the input display
  const formatPhoneString = (val) => {
    if (!val) return "";
    let cleaned = val.replace(/\D/g, "");
    if (cleaned.startsWith("04")) cleaned = cleaned.slice(2);
    cleaned = cleaned.slice(0, 8);

    let formatted = "04";
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) formatted += cleaned;
      else if (cleaned.length <= 5)
        formatted += cleaned.slice(0, 2) + " " + cleaned.slice(2);
      else
        formatted +=
          cleaned.slice(0, 2) +
          " " +
          cleaned.slice(2, 5) +
          " " +
          cleaned.slice(5);
    }
    return formatted;
  };

  // Populate form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if ((isEditMode || isViewMode) && initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          phoneNumber: formatPhoneString(initialData.phoneNumber),
          profileImage: initialData.profileImage || "",
          university:
            typeof initialData.university === "object"
              ? initialData.university._id
              : initialData.university?.name || "",
          universityName:
            typeof initialData.university === "object"
              ? initialData.university.name
              : "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          profileImage: "",
          university: "",
        });
      }
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, mode, initialData]);

  const handlePhoneFormat = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.startsWith("04")) {
      value = value.slice(2);
    }

    value = value.slice(0, 8);

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

    setErrors((prev) => {
      const { phoneNumber, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isViewMode || isLoading) return;

  const newErrors = {};
  const requiredFields = ["name", "email", "phoneNumber", "university"];

  if (isAddMode) {
    requiredFields.push("password", "confirmPassword");
  }

  requiredFields.forEach((key) => {
    if (!formData[key] || String(formData[key]).trim() === "") {
      newErrors[key] = true;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showToast("Please fill all required fields", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setErrors((prev) => ({ ...prev, email: true }));
    showToast("Valid email is required", "error");
    return;
  }

 const cleanedPhone = formData.phoneNumber.replace(/\s/g, "");
if (!/^04\d{8}$/.test(cleanedPhone)) {
  setErrors((prev) => ({ ...prev, phoneNumber: true }));
  showToast("Phone number must be in format: 04XX XXX XXX", "error");
  return;
}


  if (isAddMode) {
    if (formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: true }));
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: true,
        confirmPassword: true,
      }));
      showToast("Passwords do not match", "error");
      return;
    }
  }

  //  MULTIPART FORM DATA
  const formDataToSend = new FormData();

  formDataToSend.append("name", formData.name);
  formDataToSend.append("phoneNumber", formData.phoneNumber);
  formDataToSend.append("university", formData.university);

  if (isAddMode) {
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
  }

  if (formData.profileImageFile) {
    formDataToSend.append("profileImage", formData.profileImageFile);
  }

  onSave(formDataToSend); 
};


  if (!isOpen) return null;

  const inputBaseClasses =
    "w-full pl-10 pr-10 py-2.5 rounded-xl border transition-all duration-200 outline-none text-sm appearance-none";
  const getInputClasses = (field) => {
    const stateClasses = errors[field]
      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";
    const disabledClasses = isViewMode
      ? "bg-gray-50 text-gray-500 cursor-not-allowed"
      : "bg-white";
    return `${inputBaseClasses} ${stateClasses} ${disabledClasses}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isViewMode
                ? "Vendor Details"
                : isEditMode
                ? "Edit Vendor"
                : "Add New Vendor"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isViewMode
                ? "Reviewing record"
                : "Ensure all fields are accurate"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2  cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form
          id="vendor-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto px-8 py-6 space-y-5"
        >
          {/* Profile Image Preview */}
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative">
              <label
                htmlFor="profileImageUpload"
                className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition
        ${
          formData.profileImage
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-indigo-500 bg-gray-50"
        }`}
              >
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={28} className="text-gray-400" />
                )}
              </label>

              {/* Remove Button */}
              {!isViewMode && formData.profileImage && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      profileImage: "",
                      profileImageFile: null, 
                    }))
                  }
                  className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            {!isViewMode && (
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
              onChange={async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    showToast("Only JPG and PNG images are allowed", "error");
    return;
  }

  if (file.size > 1024 * 1024) {
    showToast("Image must be under 1MB", "error");
    return;
  }

  try {
    const compressedFile = await compressImageBelow100KB(file);

    setFormData((prev) => ({
      ...prev,
      profileImageFile: compressedFile, 
      profileImage: URL.createObjectURL(compressedFile), 
    }));
  } catch (err) {
    showToast(err.message || "Image processing failed", "error");
  }
}}


              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
                Vendor Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isViewMode}
                  placeholder="ABC Vendor"
                  className={getInputClasses("name")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneFormat}
                  disabled={isViewMode}
                  placeholder="04XX XXX XXX"
                  className={getInputClasses("phoneNumber")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isViewMode || isEditMode}
                placeholder="vendor@example.com"
                className={getInputClasses("email")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
              University
            </label>
            <div className="relative">
              <School
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              {isViewMode ? (
                <div className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm">
                  {formData.universityName || "—"}
                </div>
              ) : (
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={getInputClasses("university")}
                >
                  <option value="">Select University</option>
                  {universities?.map((uni) => (
                    <option key={uni._id} value={uni._id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {isAddMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={getInputClasses("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={getInputClasses("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>
          {!isViewMode && (
            <button
              form="vendor-form"
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Vendor"
                : "Create Vendor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorModal;
