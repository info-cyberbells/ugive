import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useDispatch } from "react-redux";
import { createUniversity, updateUniversity } from '../../../features/universitySlice';

const UniversityModal = ({ isOpen, onClose, university, isViewMode }) => {

    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [initialData, setInitialData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postcode: '',
    });

    const [errors, setErrors] = useState({});

    const isEditMode = !!university?._id;
    const title = isViewMode
        ? "View University Details"
        : isEditMode
            ? "Edit University Details"
            : "Add New University";

    useEffect(() => {
        const data = {
            name: university?.name || "",
            address_line_1: university?.address_line_1 || "",
            address_line_2: university?.address_line_2 || "",
            city: university?.city || "",
            state: university?.state || "",
            postcode: university?.postcode || ""
        };

        setFormData(data);
        setInitialData(data);
        setErrors({});
    }, [university, isOpen]);
    useEffect(() => {
        setFormData({
            name: university?.name || '',
            address_line_1: university?.address_line_1 || '',
            address_line_2: university?.address_line_2 || '',
            city: university?.city || '',
            state: university?.state || '',
            postcode: university?.postcode || '',
        });
        setErrors({});
    }, [university, isOpen]);

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

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        const requiredFields = [
            "name",
            "address_line_1",
            "city",
            "address_line_2",
            "state",
            "postcode",
        ];

        requiredFields.forEach((key) => {
            if (!formData[key] || String(formData[key]).trim() === "") {
                newErrors[key] = true;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast("Required fields must be filled!", "error");
            return;
        }

        if (isEditMode && !hasChanges()) {
            showToast("No changes detected!", "info");
            onClose();
            return;
        }

        if (isEditMode) {
            dispatch(
                updateUniversity({
                    id: university._id,
                    uniData: formData,
                })
            )
                .unwrap()
                .then(() => {
                    showToast("University updated successfully!", "success");
                    onClose();
                })
                .catch((error) => {
                    showToast(error || "Failed to update university", "error");
                });

            return;
        }


        dispatch(createUniversity(formData))
            .unwrap()
            .then(() => {
                showToast("University added successfully!", "success");
                onClose();
            })
            .catch((error) => {
                showToast(error || "Failed to add university", "error");
            });
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
                        <label className="block text-sm font-medium text-gray-700">University Name</label>
                        <input
                            disabled={isViewMode}
                            type="text"
                            name="name"
                            placeholder="Harvard University"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses("name")}
                        />
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input
                            disabled={isViewMode}
                            type="text"
                            name="address_line_1"
                            placeholder="Cambridge Campus"
                            autoComplete="off"
                            value={formData.address_line_1}
                            onChange={handleChange}
                            className={inputClasses("address_line_1")}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 2 </label>
                        <input
                            disabled={isViewMode}
                            type="text"
                            name="address_line_2"
                            placeholder="Cambridge Campus"
                            autoComplete="off"
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
                                disabled={isViewMode}
                                type="text"
                                name="city"
                                placeholder="Cambridge"
                                autoComplete="off"
                                value={formData.city}
                                onChange={handleChange}
                                className={inputClasses("city")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                disabled={isViewMode}
                                type="text"
                                name="state"
                                placeholder="Massachusetts"
                                autoComplete="off"
                                value={formData.state}
                                onChange={handleChange}
                                className={inputClasses("state")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postcode</label>
                            <input
                                disabled={isViewMode}
                                type="text"
                                name="postcode"
                                placeholder="02138"
                                autoComplete="off"
                                value={formData.postcode}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, "");
                                    setFormData((prev) => ({ ...prev, postcode: numericValue }));
                                }} 
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
                        {!isViewMode && (
                            <button
                                type="submit"
                                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-indigo-600 
                       border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition"
                            >
                                {isEditMode ? "Save Changes" : "Add University"}
                            </button>
                        )}

                    </div>

                </form>
            </div>
        </div>
    );
};

export default UniversityModal;