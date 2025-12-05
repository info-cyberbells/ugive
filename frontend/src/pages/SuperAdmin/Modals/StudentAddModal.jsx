import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { getUniversities, getColleges } from "../../../features/studentSlice";
import { getSingleStudent } from "../../../features/studentDataSlice";

const StudentModal = ({
  isOpen,
  onClose,
  student,
  onSave,
  mode,
  studentId,
}) => {
  const dispatch = useDispatch();
  const { universities, colleges } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = !studentId;

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
    college: "",
    studentUniId: "",
    password: "",
    confirmPassword: "",
  });
  const [originalData, setOriginalData] = useState(null);

  const [errors, setErrors] = useState({});

  const title = isViewMode
    ? "View Student Details"
    : isEditMode
      ? "Edit Student Details"
      : "Add New Student";

  useEffect(() => {
    if (!isOpen) return;

    if (!isViewMode) {
      dispatch(getUniversities());
    }
  }, [isOpen]);

  const handleUniversityChange = (e) => {
    const universityId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      university: universityId,
      college: "",
    }));

    if (universityId) {
      dispatch(getColleges(universityId));
    }
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
    if (!isOpen) return;

    if (!studentId) {
      // ADD MODE → RESET FORM
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        university: "",
        college: "",
        studentUniId: "",
        password: "",
        confirmPassword: "",
      });
      return;
    }

    // VIEW / EDIT → Load student data
    dispatch(getSingleStudent(studentId))
      .unwrap()
      .then((res) => {
        const s = res.data;
        setFormData({
          name: s.name || "",
          email: s.email || "",
          phoneNumber: s.phoneNumber || "",
          university: s.university?._id || "",
          college: s.college?._id || "",
          studentUniId: s.studentUniId || "",
        });
        setOriginalData({
          name: s.name || "",
          email: s.email || "",
          phoneNumber: s.phoneNumber || "",
          university: s.university?._id || "",
          college: s.college?._id || "",
          studentUniId: s.studentUniId || "",
        });
        if ((mode === "add" || mode === "edit") && s.university?._id) {
          dispatch(getColleges(s.university._id));
        }
      });
  }, [isOpen, studentId]);

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
    const requiredFields = [
      "name",
      "email",
      "phoneNumber",
      "university",
      "studentUniId",
    ];
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

    const emailRegex = /^[^\s@]+@usq\.edu\.au$/;
    if (!emailRegex.test(formData.email)) {
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

    const payload = { ...formData, id: studentId };

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
    <div className="fixed inset-0 bg-black/30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student Name
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
              placeholder="stansmith@usq.edu.au"
              autoComplete="off"
              className={inputClasses("email")}
            />
          </div>

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
                className={`${inputClasses(
                  "university"
                )} appearance-none pr-10`}
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              College
            </label>

            <div className="relative">
              <select
                name="college"
                value={formData.college || ""}
                onChange={handleChange}
                className={`${inputClasses("college")} appearance-none pr-10`}
                disabled={!formData.university || isViewMode}
              >
                {!formData.university && (
                  <option value="">Select a university first</option>
                )}

                {formData.university && colleges.length === 0 && (
                  <option value="">
                    No colleges found for this university
                  </option>
                )}

                {formData.university && colleges.length > 0 && (
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

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                name="studentUniId"
                value={formData.studentUniId}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="UG2025CS1023"
                autoComplete="off"
                className={inputClasses("studentUniId")}
              />
            </div>

            {isAddMode && (
              <>
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg cursor-pointer"
              >
                {isEditMode ? "Save Changes" : "Add Student"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
