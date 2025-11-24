import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const CollegeModal = ({ isOpen, onClose, college, onSave }) => {

    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        universityId: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postcode: '',
    });

    const [errors, setErrors] = useState({});

    const isEditMode = !!college?.id;
    const title = isEditMode ? 'Edit College Details' : 'Add New College';

    useEffect(() => {
        setFormData({
            name: college?.name || '',
            universityId: college?.universityId || '',
            address_line_1: college?.address_line_1 || '',
            address_line_2: college?.address_line_2 || '',
            city: college?.city || '',
            state: college?.state || '',
            postcode: college?.postcode || '',
        });
        setErrors({});
    }, [college, isOpen]);

    if (!isOpen) return null;

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

        setErrors((prev) => {
            const { [name]: removedError, ...restOfErrors } = prev;
            return restOfErrors;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        const requiredFields = ['name', 'universityId', 'address_line_1', 'address_line_2','city', 'state', 'postcode'];

        requiredFields.forEach((key) => {
            if (!formData[key] || String(formData[key]).trim() === '') {
                newErrors[key] = true;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            showToast("All required fields must be filled!", "error");
            console.log("All required fields must be filled!");

            return;
        }

        onSave({
            ...formData,
            id: college?.id, 
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600 rounded-full p-1 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">College Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses("name")}
                        />
                    </div>
                    
                    {/* University ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">University ID</label>
                        <input
                            type="text"
                            name="universityId"
                            value={formData.universityId}
                            onChange={handleChange}
                            className={inputClasses("universityId")}
                        />
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input
                            type="text"
                            name="address_line_1"
                            value={formData.address_line_1}
                            onChange={handleChange}
                            className={inputClasses("address_line_1")}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                        <input
                            type="text"
                            name="address_line_2"
                            value={formData.address_line_2}
                            onChange={handleChange}
                            className={inputClasses("address_line_2")}
                        />
                    </div>

                    {/* City / State / Postcode */}
                    <div className="grid grid-cols-3 gap-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={inputClasses("city")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={inputClasses("state")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postcode</label>
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                className={inputClasses("postcode")}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition"
                        >
                            {isEditMode ? 'Save Changes' : 'Add College'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CollegeModal;
