import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  createNotification,
  toggleNotification,
  updateNotification,
  deleteNotification,
  clearNotificationMessages,
} from "../../../features/notificationSlice";
import { useToast } from "../../../context/ToastContext";
import { Bell, Plus, Edit2, Trash2, Power, X, AlertCircle, Loader2 } from "lucide-react";
import ConfirmationModal from "../AdminModals/DeleteModalAdmin";

const PushNotifications = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { notifications, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.notification
  );

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    scheduledAt: "",
    isActive: true,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [toggleStatusConfirm, setToggleStatusConfirm] = useState(false);

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      showToast(message, "success");
      dispatch(clearNotificationMessages());
    }
    if (isError && message) {
      showToast(message, "error");
      dispatch(clearNotificationMessages());
    }
  }, [isSuccess, isError, message, showToast, dispatch]);

  const handleOpenModal = (notification = null) => {
    if (notification) {
      setEditMode(true);
      setSelectedNotification(notification);
      setFormData({
        title: notification.title,
        message: notification.message,
        scheduledAt: notification.scheduledAt
          ? new Date(notification.scheduledAt).toISOString().slice(0, 16)
          : "",
        isActive: notification.isActive,
      });
    } else {
      setEditMode(false);
      setSelectedNotification(null);
      setFormData({
        title: "",
        message: "",
        scheduledAt: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedNotification(null);
    setFormData({
      title: "",
      message: "",
      scheduledAt: "",
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      showToast("Title and message are required", "error");
      return;
    }

    const data = {
      title: formData.title,
      message: formData.message,
      scheduledAt: formData.scheduledAt || undefined,
      isActive: formData.isActive,
    };

    if (editMode && selectedNotification) {
      dispatch(
        updateNotification({
          id: selectedNotification._id,
          data: { message: formData.message },
        })
      )
        .unwrap()
        .then(() => {
          handleCloseModal();
        })
        .catch(() => {});
    } else {
      dispatch(createNotification(data))
        .unwrap()
        .then(() => {
          handleCloseModal();
        })
        .catch(() => {});
    }
  };

  const handleToggle = async () => {
  try {
    await dispatch(toggleNotification(toggleId)).unwrap();
    showToast(
      `Push Notification ${isNotificationActive ? "disabled" : "enabled"} successfully`,
      "success"
    );
  } catch (error) {
    showToast("Failed to update notification status.", "error");
  } finally {
    setToggleStatusConfirm(false);
    setToggleId(null);
  }
};


  const handleDelete = async () => {
    try {
      await dispatch(deleteNotification(deleteId)).unwrap();
      showToast("Push Notification deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete notification.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="lg:ml-60 mt-14 p-6 bg-gray-50 min-h-screen font-[Poppins]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Push Notifications
          </h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6955A5] hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 border border-transparent rounded-lg  shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Notification
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                </div>

                <div className="flex gap-2 ml-4">
                  <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Create your first notification to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
<div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notification.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {notification.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      <strong>Created:</strong>{" "}
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex  items-center gap-2 mt-4 sm:mt-0 ml-4">
                  <button
                    onClick={() => {
                            setToggleId(notification._id);
                            setIsNotificationActive(notification.isActive);
                            setToggleStatusConfirm(true);
                            }}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      notification.isActive
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    title="Toggle Status"
                  >
                    <Power className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(notification)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(notification._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editMode ? "Edit Notification" : "Create Notification"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editMode && (
                <h5 className="text-sm text-center">
                  Note: Before adding a new push notification, please note that
                  the older notification will be automatically disabled.
                </h5>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={editMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter notification message"
                  required
                />
              </div>

              {!editMode && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </>
              )}

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:scale-[1.02] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 font-medium text-white bg-[#6955A5] hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 border border-transparent rounded-lg  shadow-md cursor-pointer"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toggleStatusConfirm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => !isLoading && setToggleStatusConfirm(false)}
          />
          
          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex gap-3 text-amber-500">
                <AlertCircle size={20} />
              <h3 className="font-bold text-slate-900">Confirm Status Change</h3>
              </div>
              <button
                onClick={() => setToggleStatusConfirm(false)}
                className="text-gray-400 rounded-4xl hover:bg-purple-200 p-0.5 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-slate-600 text-center text-sm leading-relaxed">
                Are you sure you want to <strong>{isNotificationActive ? 'inactive' : 'active'}</strong> this push notifications? 
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 flex justify-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => setToggleStatusConfirm(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer border hover:scale-[1.01] text-slate-600 hover:text-slate-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={handleToggle}
                className="min-w-[100px] rounded-xl cursor-pointer flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#6955A5] hover:bg-[#533f8e] hover:scale-[1.02] duration-150 shadow-sm transition-all active:scale-95 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          entity="Push Notification"
          // itemName="notification"
        />
      )}
    </div>
  );
};

export default PushNotifications;
