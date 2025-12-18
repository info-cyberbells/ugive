import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "../../../context/ToastContext";
import {
  addCollegeByAdmin,
  getAdminColleges,
  updateCollegeByAdmin,
} from "../../../features/adminCollegesSlice";

const CollegeModal = ({
  isOpen,
  mode = "add", // "add" | "edit" | "view"
  initialData = null,
  universities = [],
  onClose,
  onSubmit,
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const { showToast } = useToast();

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    universityId: "",
    name: "",
    phoneNumber: "",
    address_line_1: "",
    city: "",
    state: "",
    postcode: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    // ADD MODE
    if (mode === "add") {
      const storedUniversityId = localStorage.getItem("universityId");

      setFormData({
        universityId: storedUniversityId || "",
        name: "",
        address_line_1: "",
        phoneNumber: "",
        city: "",
        state: "",
        postcode: "",
      });

      return;
    }

    // EDIT / VIEW MODE
    if ((mode === "edit" || mode === "view") && initialData) {
      const data = {
        universityId: initialData?.university?._id || "",
        name: initialData?.name || "",
        address_line_1: initialData?.address_line_1 || "",
        phoneNumber: initialData?.phoneNumber || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        postcode: initialData?.postcode || "",
      };

      setFormData(data);
    }
  }, [isOpen, mode, initialData]); // Add 'mode' to dependencies
  if (!isOpen) return null;

  const inputClasses = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 text-sm transition
   ${
     errors[field]
       ? "border-red-500 focus:ring-red-500"
       : "bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
   }`;

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

    if (formatted.replace(/\D/g, "").length < 10) {
      setErrors((prev) => ({ ...prev, phoneNumber: true }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = [
      "name",
      "universityId",
      "address_line_1",
      "phoneNumber",
      "city",
      "state",
      "postcode",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("All required fields must be filled!", "error");
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
      setErrors((prev) => ({ ...prev, phoneNumber: true }));
      showToast("Phone number must be a valid 10-digit mobile number", "error");
      return;
    }

    const payload = {
      name: formData.name,
      universityId: formData.universityId,
      address_line_1: formData.address_line_1,
      phoneNumber: formData.phoneNumber,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
    };

    if (isEditMode && initialData?._id) {
      dispatch(
        updateCollegeByAdmin({ id: initialData._id, collegeData: payload })
      )
        .unwrap()
        .then(() => {
          showToast("College updated successfully", "success");
          dispatch(getAdminColleges());
          onClose();
        })
        .catch((error) => {
          showToast(
            typeof error === "string"
              ? error
              : error?.message || "Failed to update college",
            "error"
          );
        });
    } else {
      dispatch(addCollegeByAdmin(payload))
        .unwrap()
        .then(() => {
          showToast("College added successfully", "success");
          dispatch(getAdminColleges());
          onClose();
        })
        .catch((error) => {
          showToast(
            typeof error === "string"
              ? error
              : error?.message || "Failed to add college",
            "error"
          );
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">
            {mode === "add"
              ? "Add College"
              : mode === "edit"
              ? "Edit College"
              : "View College"}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 cursor-pointer text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">College Name</label>
            <input
              name="name"
              placeholder="MIT College"
              value={formData.name}
              disabled={isViewMode}
              onChange={handleChange}
              className={inputClasses("name")}
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              name="address_line_1"
              placeholder="#128 street, west cost "
              value={formData.address_line_1}
              disabled={isViewMode}
              onChange={handleChange}
              className={inputClasses("address_line_1")}
            />
          </div>

          {/* City / State / Postcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                placeholder="0412 345 678"
                disabled={isViewMode}
                value={formData.phoneNumber}
                onChange={handlePhoneFormat}
                className={inputClasses("phoneNumber")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                name="city"
                placeholder="Melbourne"
                disabled={isViewMode}
                value={formData.city}
                onChange={handleChange}
                className={inputClasses("city")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                name="state"
                placeholder="VIC"
                disabled={isViewMode}
                value={formData.state}
                onChange={handleChange}
                className={inputClasses("state")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Post Code
              </label>
              <input
                name="postcode"
                placeholder="865756"
                disabled={isViewMode}
                value={formData.postcode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  setFormData((prev) => ({
                    ...prev,
                    postcode: value,
                  }));

                  setErrors((prev) => {
                    const { postcode, ...rest } = prev;
                    return rest;
                  });
                }}
                className={inputClasses("postcode")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
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
                className="px-4 py-2 text-sm font-medium  text-white bg-[#6955A5] hover:bg-[#533f8e] hover:scale-[1.02] rounded-lg cursor-pointer"
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
