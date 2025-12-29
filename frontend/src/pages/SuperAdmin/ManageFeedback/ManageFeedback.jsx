import React, { useState, useEffect } from "react";
import {
  ArrowUpDown,
  MessageSquare,
  Trash2,
  Filter,
  Download,
  Plus,
  User,
  Mail,
  Calendar,
  UserCog,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFeedbacks,
  deleteFeedback,
} from "../../../features/feedbackSlice";
import ConfirmationModal from "../Modals/deleteModal";
import { useToast } from "../../../context/ToastContext";

const Feedback = () => {
  const { showToast } = useToast();

  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const isAnySelected = selectedFeedbackIds.length > 0;

  const { allFeedbacks, total, isLoading, isError } = useSelector(
    (state) => state.feedback
  );

  useEffect(() => {
    dispatch(getAllFeedbacks());
  }, []);



  const toggleSelect = (id) => {
    setSelectedFeedbackIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFeedbackIds.length === allFeedbacks.length) {
      setSelectedFeedbackIds([]);
    } else {
      setSelectedFeedbackIds(allFeedbacks.map((f) => f._id));
    }
  };

  const openViewModal = (feedback) => {
    setSelectedFeedback(feedback);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedFeedback(null);
  };

  // open delete modal
  const openSingleDeleteModal = (feedback) => {
    setFeedbackToDelete(feedback);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    setIsBulkDelete(true);
    setFeedbackToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFeedbackToDelete(null);
    setIsBulkDelete(false);
  };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        // Bulk delete
        for (const id of selectedFeedbackIds) {
          await dispatch(deleteFeedback({ id })).unwrap();
        }

        showToast(
          `${selectedFeedbackIds.length} feedback(s) deleted`,
          "success"
        );

        // Clear selected
        setSelectedFeedbackIds([]);
      } else if (feedbackToDelete) {
        // Single delete
        await dispatch(deleteFeedback({ id: feedbackToDelete._id })).unwrap();

        showToast("Feedback deleted successfully", "success");
      }

      // Refresh list
      dispatch(getAllFeedbacks());
    } catch (err) {
      showToast(err || "Failed to delete feedback", "error");
    }

    // Close modal
    closeDeleteModal();
  };

  const handleExportFeedbackCSV = () => {
    const selected = allFeedbacks.filter((fb) =>
      selectedFeedbackIds.includes(fb._id)
    );

    if (selected.length === 0) {
      showToast("No feedback selected!", "error");
      return;
    }

    const headers = ["Student Name", "Email", "Role", "Date Sent", "Feedback"];

    const rows = selected.map((fb) => [
      fb.user?.name,
      fb.user?.email,
       fb.user?.role,
      new Date(fb.createdAt).toLocaleDateString(),
      fb.feedback,
    ]);

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "feedback_export.csv");
    document.body.appendChild(link);
    link.click();

    showToast("Feedback CSV exported successfully!", "success");
  };

  const FeedbackTableSkeleton = () => {
    const rows = Array(6).fill(0);

    return (
      <div className="overflow-x-auto animate-pulse">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-10 px-2 py-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </th>

              {["Student", "Email", "Date Sent", "Summary", "Action"].map(
                (header) => (
                  <th key={header} className="px-6 py-3">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-4">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const FeedbackViewModal = () => {
    if (!viewModalOpen || !selectedFeedback) return null;

    const data = selectedFeedback;

    const formattedDate = new Date(data.createdAt).toLocaleDateString();
    const formattedTime = new Date(data.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="fixed inset-0 font-[Poppins] bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative border border-gray-100">
          {/* Header */}
          <div className="p-5 bg-gray-50 border-b border-gray-200 rounded-t-xl flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight text-gray-800 flex items-center gap-2">
              <MessageSquare size={24} className="text-indigo-600" />
              Feedback Details
            </h2>

            <button
              onClick={closeViewModal}
              className="text-gray-400 cursor-pointer hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Feedback Title */}
            {/* <div className="pb-2 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 leading-tight">
                {data.subject || "Feedback"}
              </h3>
            </div> */}

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/*  Name */}
              <dl className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <dt className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <User size={14} className="text-indigo-500" /> Name
                </dt>
                <dd className="text-base text-gray-900 font-semibold mt-1 truncate">
                  {data.user?.name || "Unknown"}
                </dd>
              </dl>

              {/* Email */}
              <dl className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <dt className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Mail size={14} className="text-indigo-500" /> Email
                </dt>
                <dd className="text-sm text-indigo-600 hover:underline mt-1 truncate">
                  {data.user?.email || "N/A"}
                </dd>
              </dl>


 <dl className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <dt className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <UserCog size={14} className="text-indigo-500" /> Role
                </dt>
                <dd className="text-sm text-indigo-600 hover:underline mt-1 truncate">
                  {data.user?.role || "N/A"}
                </dd>
              </dl>


              {/* Date */}
              <dl className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <dt className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={14} className="text-indigo-500" /> Sent
                </dt>
                <dd className="text-sm text-gray-700 mt-1">
                  {formattedDate}
                  <span className="ml-1 text-xs font-medium text-gray-400">
                    ({formattedTime})
                  </span>
                </dd>
              </dl>
            </div>

            {/* Full Feedback Message */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Full Message:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-inner max-h-60 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm">
                  {data.feedback}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 text-right bg-gray-50 rounded-b-xl">
            <button
              onClick={closeViewModal}
              className="px-6 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-13 lg:mt-14 lg:ml-56 font-[Inter] bg-gray-50 px-1 py-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {/* <MessageSquare className="h-6 w-6 mt-1 text-indigo-600 mr-2" /> */}
            Feedback List
            <span className="text-sm mt-2 text-gray-500 font-normal ml-3">
              {total} Feedbacks
            </span>
          </h1>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex justify-around space-x-3 w-full sm:w-auto">
              <button
                className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300
          rounded-lg transition duration-150 shadow-sm
          ${isAnySelected
                    ? "text-gray-700 cursor-pointer bg-white hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                disabled={!isAnySelected}
                onClick={openBulkDeleteModal}
              >
                Delete ({selectedFeedbackIds.length})
                <Trash2 className="h-5 w-5 ml-2" />
              </button>

              {/* EXPORT BUTTON */}
              <button
                onClick={handleExportFeedbackCSV}
                className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300
          rounded-lg transition duration-150 shadow-sm
          ${isAnySelected
                    ? "text-gray-700 cursor-pointer bg-white hover:bg-gray-50 cursor-pointer"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          {isLoading ? (
            <FeedbackTableSkeleton />
          ) : total > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Checkbox Column */}
                    <th
                      className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFeedbackIds.length === allFeedbacks.length
                        }
                        onChange={toggleSelectAll}
                        className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </th>

                    {/* Student */}
                    <th
                      scope="col"
                      className="sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      Name
                    </th>

                    {/* Email */}
                    <th
                      scope="col"
                      className="hidden lg:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      Email
                    </th>

                    <th
                      scope="col"
                      className="hidden lg:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      Role
                    </th>

                    {/* Date Sent */}
                    <th
                      scope="col"
                      className=" sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      Date Sent
                    </th>

                    {/* Summary */}
                    <th
                      scope="col"
                      className="hidden lg:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                    >
                      Summary
                    </th>

                    {/* Action */}
                    <th
                      scope="col"
                      className="sm:px-6 py-1 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {allFeedbacks.map((feedback) => (
                    <tr
                      key={feedback._id}
                      className="hover:bg-indigo-50/50 transition duration-150"
                    >
                      <td
                        className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeedbackIds.includes(feedback._id)}
                          onChange={() => toggleSelect(feedback._id)}
                          className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="sm:px-6 py-1 sm:py-4 whitespace-nowrap text-xs sm:text-sm sm:font-medium text-gray-900">
                        {feedback.user?.name}
                      </td>
                      <td className="hidden lg:table-cell sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                        {feedback.user?.email}
                      </td>

                      <td className="hidden lg:table-cell sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                        {feedback.user?.role}
                      </td>
                      <td className=" sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </td>
                      {/* Truncated Summary */}
                      <td className="hidden lg:table-cell sm:px-6 sm:py-4 text-sm text-gray-600 max-w-xs truncate">
                        {feedback.feedback}
                      </td>
                      <td className="sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-3">
                        <button
                          onClick={() => openViewModal(feedback)}
                          className="text-blue-600 cursor-pointer hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openSingleDeleteModal(feedback)}
                          className="text-red-600 cursor-pointer hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No feedback entries
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No user have submitted feedback yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <FeedbackViewModal />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={isBulkDelete ? selectedFeedbackIds.length : 1}
        entity="feedback"
        itemName={feedbackToDelete?.user?.name}
      />
    </div>
  );
};

export default Feedback;
