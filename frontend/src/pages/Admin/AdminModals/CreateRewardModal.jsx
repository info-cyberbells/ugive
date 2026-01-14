import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVendorRewardByAdmin,
  updateVendorRewardByAdmin,
} from "../../../features/adminRewardSlice";

const CreateReward = ({
  isOpen,
  onClose,
  rewardId,
  onSave,
  mode,
  page,
  limit,
}) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [rewardImage, setRewardImage] = useState(null);
  const [rewardImagePreview, setRewardImagePreview] = useState(null);
  const { selectedVendorReward: selectedReward } = useSelector(
    (state) => state.adminReward
  );
  const [selectedRewardImagePath, setSelectedRewardImagePath] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRewardImage(file);
    setRewardImagePreview(URL.createObjectURL(file)); // preview
  };

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    rewardDescription: "",
    rewardImage: "",
  });
  const [originalData, setOriginalData] = useState(null);

  const [errors, setErrors] = useState({});

  const title = isViewMode
    ? "View Reward Details"
    : isEditMode
    ? "Edit Reward Details"
    : "Add New Reward";

  useEffect(() => {
    if (isOpen && (isEditMode || isViewMode) && selectedReward) {
      setRewardImage(null);
      setRewardImagePreview(null);
      setSelectedRewardImagePath("");
      setFormData({
        name: selectedReward.name || "",
        rewardDescription: selectedReward.description || "",
      });

      if (selectedReward.rewardImage) {
        setRewardImagePreview(selectedReward.rewardImage);
        setSelectedRewardImagePath(selectedReward.rewardImage);
      }
    }
  }, [isOpen, selectedReward, isEditMode, isViewMode]);

  const resetForm = () => {
    setFormData({
      name: "",
      totalPoints: "",
      rewardDescription: "",
      rewardImage: "",
    });
    setRewardImage(null);
    setRewardImagePreview(null);
    setSelectedRewardImagePath("");
    setErrors({});
  };
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
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = ["name", "rewardDescription"];

    requiredFields.forEach((key) => {
      if (!formData[key] || String(formData[key]).trim() === "") {
        newErrors[key] = true;
      }
    });

    if (!rewardImagePreview) {
      newErrors.rewardImage = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields", "error");
      return;
    }

    const payload = { ...formData, id: rewardId };

    if (isEditMode) {
      const updatedForm = new FormData();

      updatedForm.append("name", formData.name);
      updatedForm.append("description", formData.rewardDescription);

      if (rewardImage) {
        updatedForm.append("rewardImage", rewardImage);
      }

      dispatch(
        updateVendorRewardByAdmin({ id: rewardId, formData: updatedForm })
      )
        .unwrap()
        .then(() => {
          showToast("Reward updated successfully!", "success");
          dispatch(getAllVendorRewardByAdmin({ page, limit }));
          resetForm();
          onClose();
        })
        .catch((err) => {
          console.log(err);
          showToast("Failed to update reward", "error");
        });

      return;
    }

    const saveData = {
      name: formData.name,
      rewardDescription: formData.rewardDescription,
    };

    if (rewardImage) {
      saveData.rewardImage = rewardImage;
    } else if (selectedRewardImagePath) {
      saveData.rewardImagePath = selectedRewardImagePath;
    }

    onSave(saveData);
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            // onClick={onClose}
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reward Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={isViewMode}
              onChange={handleChange}
              placeholder="Coffee"
              autoComplete="off"
              className={inputClasses("name")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reward Description
            </label>
            <textarea
              type="text"
              name="rewardDescription"
              value={formData.rewardDescription}
              disabled={isViewMode}
              onChange={handleChange}
              placeholder="Get Free Coffee"
              autoComplete="off"
              className={inputClasses("rewardDescription")}
            />
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Image
              </label>

              {!rewardImagePreview && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`block w-full text-sm text-gray-700 file:mr-3 file:py-2
                 file:px-4 file:rounded-md file:border-0
                 ${
                   errors.rewardImage
                     ? "file:bg-red-100 file:text-red-600 "
                     : "file:bg-indigo-50 file:text-indigo-600"
                 }
                 hover:file:bg-indigo-100 cursor-pointer`}
                />
              )}

              {rewardImagePreview && (
                <div className="relative inline-block mt-2">
                  <img
                    src={rewardImagePreview}
                    alt="Reward"
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setRewardImage(null);
                        setRewardImagePreview(null);
                        setFormData((prev) => ({ ...prev, rewardImage: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 text-black rounded-full
                   w-5 h-5 flex items-center justify-center text-sm shadow-md
                   hover:bg-red-300 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
            >
              Cancel
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition"
              >
                {isEditMode ? "Save Changes" : "Add Reward"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReward;
