import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { getUniversities } from '../../../features/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createCollege, updateCollege } from '../../../features/collegesSlice';

const CollegeModal = ({ isOpen, onClose, college, onSave, isViewMode }) => {

    const { showToast } = useToast();

    const dispatch = useDispatch();

    const [initialData, setInitialData] = useState({});

    const { universities } = useSelector((state) => state.auth);

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

    const isEditMode = college && college._id ? true : false;
    ;
    const title = isViewMode ? "View College Details" : isEditMode ? 'Edit College Details' : 'Add New College';

    useEffect(() => {
        dispatch(getUniversities());
    }, [dispatch]);



    useEffect(() => {
        if (college && college._id) {
            const data = {
                name: college?.name || "",
                universityId: college?.university?._id || "",
                address_line_1: college?.address_line_1 || "",
                address_line_2: college?.address_line_2 || "",
                city: college?.city || "",
                state: college?.state || "",
                postcode: college?.postcode || "",
            };

            setFormData(data);
            setInitialData(data);
        } else {
            setFormData({
                name: "",
                universityId: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                postcode: "",
            });
            setInitialData({});
        }

        setErrors({});
    }, [college, isOpen]);




    if (!isOpen) return null;

    const inputClasses = (field) =>
        `mt-1 block w-full rounded-lg border shadow-sm sm:text-sm p-2 transition duration-150
    ${errors[field]
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`;


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


    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        const requiredFields = ['name', 'universityId', 'address_line_1', 'city', 'state', 'postcode'];

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

        if (isEditMode && !hasChanges()) {
            showToast("No changes detected!", "info");
            onClose();
            return;
        }

        if (isEditMode) {
            dispatch(
                updateCollege({
                    id: college._id,
                    collegeData: formData,
                })
            )
                .unwrap()
                .then(() => {
                    showToast("College info updated successfully!", "success");
                    setFormData({
                        name: "",
                        universityId: "",
                        address_line_1: "",
                        // address_line_2: "",
                        city: "",
                        state: "",
                        postcode: "",
                    });
                    onClose();
                })
                .catch((error) => {
                    showToast(error || "Failed to update college info", "error");
                });

            return;
        }

        dispatch(createCollege(formData))
            .unwrap()
            .then(() => {
                showToast("College added successfully!", "success");
                setFormData({
                    name: "",
                    universityId: "",
                    address_line_1: "",
                    // address_line_2: "",
                    city: "",
                    state: "",
                    postcode: "",
                });

                setInitialData({});
                onClose();
            })
            .catch((error) => {
                showToast(error || "Failed to add College", "error");
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            University Name
                        </label>

                        <div className="relative">
                            <select
                                id="universityId"
                                name="universityId"
                                value={formData.universityId}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`${inputClasses("universityId")} appearance-none pr-10`}
                            >
                                <option value="">Select your university</option>
                                {universities?.map((uni) => (
                                    <option key={uni._id} value={uni._id}>
                                        {uni.name}
                                    </option>
                                ))}
                            </select>

                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>


                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">College Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='College of Science and Engineering'
                            disabled={isViewMode}
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClasses("name")}
                        />
                    </div>


                    {/* University ID */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">University ID</label>
                        <input
                            type="text"
                            name="universityId"
                            value={formData.universityId}
                            onChange={handleChange}
                            className={inputClasses("universityId")}
                        />
                    </div> */}

                    {/* Address Line 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input
                            type="text"
                            name="address_line_1"
                            placeholder='Massachusetts Hall, Cambridge, MA 02138, United States'
                            disabled={isViewMode}
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
                            disabled={isViewMode}
                            value={formData.address_line_2}
                            placeholder='LA Down Town, LA, California 02138, United States'
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
                                placeholder='LA'
                                disabled={isViewMode}
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
                                placeholder='California'
                                disabled={isViewMode}
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
                                placeholder='948773'
                                disabled={isViewMode}
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
                                {isEditMode ? "Save Changes" : "Add College"}
                            </button>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CollegeModal;
