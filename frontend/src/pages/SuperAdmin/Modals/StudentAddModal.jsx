import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useDispatch, useSelector } from "react-redux";
import { getUniversities, getColleges } from "../../../features/studentSlice";


const StudentModal = ({ isOpen, onClose, student, onSave }) => {
    const dispatch = useDispatch();
    const { universities, colleges } = useSelector((state) => state.auth);
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: '',
        college: '',
        studentUniId: '',
        password: '',
        confirmPassword: '',
    });


    const [errors, setErrors] = useState({});

    const isEditMode = !!student?.id;
    const title = isEditMode ? 'Edit Student Details' : 'Add New Student';

    useEffect(() => {
        if (isOpen) {
            dispatch(getUniversities());
        }
    }, [isOpen]);

    const handleUniversityChange = (e) => {
        const universityId = e.target.value;

        setFormData((prev) => ({
            ...prev,
            university: universityId,
            college: ""
        }));

        if (universityId) {
            dispatch(getColleges(universityId));
        }
    };


    useEffect(() => {
        setFormData({
            name: student?.name || '',
            email: student?.email || '',
            phone: student?.phone || '',
        });
        setErrors({});
    }, [student, isOpen]);

    if (!isOpen) return null;

    // Input classes with base 'border' class and conditional error styling
    const inputClasses = (field) =>
        `mt-1 block w-full rounded-lg border shadow-sm sm:text-sm p-2 transition duration-150 
        ${errors[field]
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        }`;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear the specific error key from the errors state object on change
        setErrors((prev) => {
            const { [name]: removedError, ...restOfErrors } = prev;
            return restOfErrors;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        const requiredFields = ['name', 'email', 'phone'];

        requiredFields.forEach((key) => {
            // Check for empty string, null, or undefined after trimming whitespace
            if (!formData[key] || String(formData[key]).trim() === '') {
                newErrors[key] = true;
            }
        });

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = true;
            showToast("Invalid email format!", "error");
        }


        // If error -> stop + toast
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (!Object.keys(newErrors).includes('email')) {
                showToast("Required fields must be filled!", "error");
            }
            console.log("Validation failed:", newErrors);

            return;
        }

        console.log("Final valid data being saved:", formData);

        // Save + close
        onSave({
            ...formData,
            id: student?.id,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Carter"
                            autoComplete="off"
                            className={inputClasses("name")}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="+1 9876543210"
                            autoComplete="off"
                            className={inputClasses("email")}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">University</label>

                        <div className="relative">
                            <select
                                name="university"
                                value={formData.university || ""}
                                onChange={handleUniversityChange}
                                className={`${inputClasses("university")} appearance-none pr-10`}
                            >
                                <option value="">Select University</option>
                                {universities.map((u) => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
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
                        <label className="block text-sm font-medium text-gray-700">College</label>

                        <div className="relative">
                            <select
                                name="college"
                                value={formData.college || ""}
                                onChange={handleChange}
                                className={`${inputClasses("college")} appearance-none pr-10`}
                                disabled={!formData.university}
                            >
                                {!formData.university && (
                                    <option value="">Select a university first</option>
                                )}

                                {formData.university && colleges.length === 0 && (
                                    <option value="">No colleges found for this university</option>
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
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 9876543210"
                                autoComplete="off"
                                className={inputClasses("phone")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <input
                                type="text"
                                name="studentUniId"
                                value={formData.studentUniId}
                                onChange={handleChange}
                                placeholder="UG2025CS1023"
                                autoComplete="off"
                                className={inputClasses("studentUniId")}
                            />
                        </div>

                        {!isEditMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>

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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}


                        {!isEditMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>

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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                    >
                                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
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
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition"
                        >
                            {isEditMode ? 'Save Changes' : 'Add Student'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default StudentModal;
