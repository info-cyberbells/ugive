import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const StudentModal = ({ isOpen, onClose, student, onSave }) => {

    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState({});

    const isEditMode = !!student?.id;
    const title = isEditMode ? 'Edit Student Details' : 'Add New Student';

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
        ${
            errors[field]
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition">
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
                            className={inputClasses("email")}
                        />
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
                                className={inputClasses("phone")}
                           />
                        </div>

                        
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition"
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
