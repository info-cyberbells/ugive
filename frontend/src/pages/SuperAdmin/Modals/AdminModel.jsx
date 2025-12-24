import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { getUniversities, getColleges } from "../../../features/studentSlice";
import { getSingleAdminBySuperAdmin } from "../../../features/superadminAdminSlice";
// import { getSingleAdmin } from "../../../features/adminDataSlice";

const AdminModal = ({
  isOpen,
  onClose,
  admin,
  onSave,
  mode,
  adminId,
}) => {
  const dispatch = useDispatch();
  const { universities, colleges } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = !adminId;

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    university: "",
    colleges: [], // Multiple colleges
    password: "",
    confirmPassword: "",
  });
  const [originalData, setOriginalData] = useState(null);

  const [errors, setErrors] = useState({});

  const title = isViewMode
    ? "View Admin Details"
    : isEditMode
      ? "Edit Admin Details"
      : "Add New Admin";

  useEffect(() => {
    if (!isOpen) return;
    dispatch(getUniversities());
  }, [isOpen]);

  const handleUniversityChange = (e) => {
    const universityId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      university: universityId,
      colleges: [], // Reset colleges when university changes
    }));

    if (universityId) {
      dispatch(getColleges(universityId));
    }
  };

  const handleCollegeSelection = (collegeId) => {
    setFormData((prev) => {
      const currentColleges = prev.colleges || [];
      if (currentColleges.includes(collegeId)) {
        // Remove college if already selected
        return {
          ...prev,
          colleges: currentColleges.filter((id) => id !== collegeId),
        };
      } else {
        // Add college if not selected
        return {
          ...prev,
          colleges: [...currentColleges, collegeId],
        };
      }
    });

    // Clear college error if exists
    setErrors((prev) => {
      const { colleges, ...rest } = prev;
      return rest;
    });
  };

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
        formatted += value.slice(0, 2) + " " + value.slice(2, 5) + " " + value.slice(5);
      }
    }

    setFormData((prev) => ({ ...prev, phoneNumber: formatted }));
    setErrors((prev) => {
      const { phoneNumber, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
  if (!isOpen) {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      university: "",
      colleges: [],
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  }
}, [isOpen]);


  useEffect(() => {
  if (!isOpen || !adminId) return;

  dispatch(getSingleAdminBySuperAdmin(adminId))
    .unwrap()
    .then((res) => {
      const a = res.data;

      const collegeIds = a.colleges?.map((c) => c._id) || [];

      setFormData({
        name: a.name || "",
        email: a.email || "",
        phoneNumber: a.phoneNumber || "",
        university: a.university?._id || "",
        colleges: collegeIds,
        password: "",
        confirmPassword: "",
      });

      setOriginalData({
        name: a.name || "",
        email: a.email || "",
        phoneNumber: a.phoneNumber || "",
        university: a.university?._id || "",
        colleges: collegeIds,
      });

      if (a.university?._id) {
        dispatch(getColleges(a.university._id));
      }
    });
}, [isOpen, adminId, dispatch]);

  if (!isOpen) return null;

  const inputClasses = (field) =>
    `mt-1 block w-full rounded-lg border shadow-sm sm:text-sm p-2 transition duration-150 
        ${errors[field]
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
    }`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const { [name]: removedError, ...restOfErrors } = prev;
      return restOfErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    // Check if at least one college is selected
    if (!formData.colleges || formData.colleges.length === 0) {
      newErrors.colleges = true;
      showToast("Please select at least one college", "error");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (!newErrors.colleges) {
        showToast("Please fill all required fields", "error");
      }
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@usq\.edu\.au$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: true }));
      showToast("Only @usq.edu.au email is allowed", "error");
      return;
    }

    const cleanedPhone = formData.phoneNumber.replace(/\s/g, "");

    if (!/^04\d{8}$/.test(cleanedPhone)) {
      setErrors((prev) => ({ ...prev, phoneNumber: true }));
      showToast("Phone number must be in format: 04XX XXX XXX", "error");
      return;
    }

    if (isAddMode || formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        setErrors((prev) => ({ ...prev, password: true }));
        showToast("Password must be at least 6 characters long", "error");
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

    const payload = { ...formData, id: adminId };

    if (!isAddMode && !formData.password && !formData.confirmPassword) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    if (isEditMode) {
      const { password, confirmPassword, ...currentValues } = formData;

      if (JSON.stringify(currentValues) === JSON.stringify(originalData)) {
        showToast("No changes detected!", "info");
        onClose();
        return;
      }
    }
    
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0  px-4 py-6 bg-black/30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 ">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Admin Name
                </label>
                <input
                type="text"
                name="name"
                value={formData.name}
                disabled={isViewMode}
                onChange={handleChange}
                placeholder="John Carter"
                autoComplete="off"
                className={inputClasses("name")}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                Phone Number 
                </label>
                <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneFormat}
                disabled={isViewMode}
                placeholder="0405 150 817"
                autoComplete="off"
                className={inputClasses("phoneNumber")}
                />
            </div>
            </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email 
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="admin@usq.edu.au"
              autoComplete="off"
              className={inputClasses("email")}
            />
          </div>

         

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              University 
            </label>
            <div className="relative">
              <select
                name="university"
                value={formData.university || ""}
                onChange={handleUniversityChange}
                disabled={isViewMode}
                className={`${inputClasses("university")} appearance-none pr-10`}
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
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

          {/* Multiple Colleges Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colleges
            </label>
            
            {!formData.university ? (
              <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg border border-gray-200">
                Please select a university first
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg border border-gray-200">
                No colleges available for this university
              </div>
            ) : (
              <div
                className={`border rounded-lg p-1 space-y-1 max-h-48 overflow-y-auto ${
                  errors.colleges ? "border-red-500" : "border-gray-300"
                }`}
              >
                {colleges.map((college) => (
                  <label
                    key={college._id}
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition ${
                      isViewMode ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.colleges.includes(college._id)}
                      onChange={() => handleCollegeSelection(college._id)}
                      disabled={isViewMode}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      {college.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {formData.colleges.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData.colleges.length} college
                {formData.colleges.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Password Fields (Only for Add Mode) */}
          {isAddMode && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password 
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="new-password"
                    className={`${inputClasses("password")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password 
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="new-password"
                    className={`${inputClasses("confirmPassword")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
            >
              Cancel
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer transition"
              >
                {isEditMode ? "Save Changes" : "Add Admin"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;