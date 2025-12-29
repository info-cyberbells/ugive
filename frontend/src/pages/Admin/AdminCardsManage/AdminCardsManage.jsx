import React, { useEffect, useState } from "react";
import { Trash2, Filter, Download, X, Printer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCardByAdmin,
  getAdminStudentCards,
  updateCardStatusByAdmin,
} from "../../../features/adminCardSlice";
import ConfirmationModal from "../AdminModals/DeleteModalAdmin";
import ViewCardModal from "../AdminModals/ViewSentCardDetails";
import { useToast } from "../../../context/ToastContext";
import PrintPreviewModal from "./PrintPreviewModal";


const AdminManageCards = () => {
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewCard, setViewCard] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("single");
  const [cardToDelete, setCardToDelete] = useState(null);

  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({
    cardId: null,
    currentStatus: null,
    newStatus: null
  });
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [cardToPrint, setCardToPrint] = useState(null);

  const {
    adminCards,
    page,
    limit,
    total,
    totalPages,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.adminCard);

  useEffect(() => {
    dispatch(getAdminStudentCards({ page, limit }));
  }, [dispatch]);

  const data = adminCards;

  const isAllSelected =
    selectedCardIds.length === data.length && data.length > 0;
  const isAnySelected = selectedCardIds.length > 0;

  const handleStatusChangeClick = (card, newStatus) => {
    setStatusChangeData({
      cardId: card._id,
      currentStatus: card.status,
      newStatus: newStatus
    });
    setIsStatusChangeModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      await dispatch(updateCardStatusByAdmin({
        cardId: statusChangeData.cardId,
        status: statusChangeData.newStatus
      })).unwrap();
      showToast("Card status updated successfully", "success");
    } catch (error) {
      showToast(error || "Failed to update status", "error");
    } finally {
      setIsStatusChangeModalOpen(false);
      setStatusChangeData({ cardId: null, currentStatus: null, newStatus: null });
    }
  };

  const handleCloseStatusModal = () => {
    setIsStatusChangeModalOpen(false);
    setStatusChangeData({ cardId: null, currentStatus: null, newStatus: null });
  };

  const handleClosePrintPreview = () => {
    setIsPrintPreviewOpen(false);
    setCardToPrint(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteMode === "single" && cardToDelete?._id) {
        await dispatch(deleteCardByAdmin(cardToDelete._id)).unwrap();
        showToast("Card deleted successfully", "success");
      }

      if (deleteMode === "bulk") {
        await Promise.all(
          selectedCardIds.map((id) => dispatch(deleteCardByAdmin(id)).unwrap())
        );

        showToast(
          `${selectedCardIds.length} cards deleted successfully`,
          "success"
        );

        setSelectedCardIds([]);
      }
    } catch (error) {
      showToast(error || "Failed to delete card(s)", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(getAdminStudentCards({ page: newPage, limit }));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(
      getAdminStudentCards({
        page: 1,
        limit: Number(newLimit),
      })
    );
    setSelectedCardIds([]);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setCardToDelete(null);
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewCard(null);
  };

  // Handler to select/deselect all  cards
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCardIds(data.map((card) => card._id));
    } else {
      setSelectedCardIds([]);
    }
  };

  // Handler to select/deselect a single  card
  const handleSelectCard = (_id) => {
    setSelectedCardIds((prevSelected) => {
      if (prevSelected.includes(_id)) {
        // Deselect
        return prevSelected.filter((cardId) => cardId !== _id);
      } else {
        // Select
        return [...prevSelected, _id];
      }
    });
  };

  const handleExport = () => {
  const selected =
    selectedCardIds.length > 0
      ? data.filter((card) => selectedCardIds.includes(card._id))
      : data;

  if (selected.length === 0) {
    showToast("No cards selected!", "error");
    return;
  }

  const headers = [
    "Sender Name",
    "Sender Email",
    "Receiver Name",
    "Receiver Email",
    "College House",
    "Reward",
    "Message",
    "Status",
    "Sent At",
  ];

  const rows = selected.map((card) => [
    card.sender_name || "N/A",
    card.sender?.email || "N/A",
    `${card.recipient_name || ""} ${card.recipient_last_name || ""}`.trim() ||
      "N/A",
    card.recipient_email || "N/A",
    card.college_name || "N/A",
    card.reward?.name || "N/A",
    card.message || "N/A",
    card.status || "N/A",
    card.sent_at
      ? new Date(card.sent_at).toLocaleString()
      : "N/A",
  ]);

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    return `"${String(value).replace(/"/g, '""')}"`;
  };

  const csvContent =
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admin_cards.csv";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast("Cards exported successfully!", "success");
};


  const TableSkeleton = () => (
    <>
      <thead>
        <tr className="bg-gray-50 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <th key={i} className="px-6 py-3">
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-2 sm:px-6 sm:py-4">
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden md:table-cell">
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-8 w-24 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );

  if (isError) {
    return (
      <main className="mt-14 lg:ml-60 font-[Inter] min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            Error:{" "}
            {typeof message === "string" ? message : "Failed to load data"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen lg:ml-60 mt-14 font-[Inter] bg-gray-50 p-4 sm:p-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section (Now responsive to selection state) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Card's List
            <span className="text-sm text-gray-500 font-normal ml-3">
              {data.length} cards
            </span>
          </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
            {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setDeleteMode("bulk");
                  setIsDeleteModalOpen(true);
                }}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${isAnySelected
                  ? "text-gray-700 bg-white cursor-pointer hover:bg-red-50 hover:text-red-600"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                aria-label="Delete Selected"
                disabled={!isAnySelected}
              >
                Delete ({selectedCardIds.length})
                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
              </button>

              {/* Export Button */}
              <button
              onClick={handleExport}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                  ? "text-gray-700 bg-white cursor-pointer hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
              </button>
            </div>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading || data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 ">
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  <>
                    <thead>
                      <tr className="bg-gray-50">
                        {/* Selection Checkbox Header */}
                        <th
                          scope="col"
                          className=" px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </th>

                        <th className="sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sender
                        </th>
                        <th className="px-6 py-3 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                          Receiver
                        </th>
                        <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                          Reward
                        </th>
                        {/* <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Card ID
                    </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Print Status
                        </th>
                        {/* <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Delivery Status
                    </th> */}
                        <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th
                          scope="col"
                          className=" sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">Actions</div>
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((card) => (
                        <tr
                          key={card._id}
                          className={`transition duration-150 ${selectedCardIds.includes(card._id)
                            ? "bg-indigo-50 hover:bg-indigo-100"
                            : "hover:bg-gray-50"
                            }`}
                        >
                          {/* Individual Selection Checkbox */}
                          <td className="px-2 sm:px-6 sm:py-4 whitespace-nowrap w-4">
                            <input
                              type="checkbox"
                              checked={selectedCardIds.includes(card._id)}
                              onChange={() => handleSelectCard(card._id)}
                              className="form-checkbox cursor-pointer h-2 w-2  sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </td>

                          {/* Name Column (Bold Text) */}
                          {/* Sender Name */}
                          <td className="sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {card.sender_name}
                          </td>

                          {/* Receiver Name */}
                          <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap text-sm text-gray-600">
                            {card.recipient_name || "Invaild Receiver"}
                          </td>

                          <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                            {card.reward?.name || "N/A"}
                          </td>
                          {/* <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {card.cardId || "N/A"}
                      </td> */}

                          {/* Print Status */}
                          {/* Print Status */}
                          <td className="sm:px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <select
                                value={card.status}
                                disabled={card.status === "delivered" || card.status === "printed"}
                                onChange={(e) =>
                                  handleStatusChangeClick(card, e.target.value)
                                }
                                className={`px-2 py-1 border rounded-md text-sm
    bg-white focus:outline-none focus:ring-1
    focus:ring-indigo-500
    ${card.status === "delivered" || card.status === "printed" ? "bg-gray-100 cursor-not-allowed" : ""}
  `}
                              >
                                <option value="pending">Pending</option>
                                {card.reward && card.reward !== null && (
                                  <option value="printed">Printed</option>
                                )}
                                <option value="delivered">Delivered</option>
                              </select>

                              {/* Print Button - Only show if status is "printed" */}
                              {(card.status === "printed" || card.status === "delivered") && (
                                <button
                                  onClick={() => {
                                    setCardToPrint(card);
                                    setIsPrintPreviewOpen(true);
                                  }}
                                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                                  title="Print Card"
                                >
                                  <Printer className="w-3 h-3" />
                                  Print
                                </button>
                              )}
                            </div>
                          </td>


                          {/* Description */}
                          <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                            {card.message || "N/A"}
                          </td>
                          <td className="sm:px-6 py-4 space-x-2 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                setViewCard(card);
                                setIsViewModalOpen(true);
                              }}
                              className="cursor-pointer text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                setDeleteMode("single");
                                setCardToDelete(card);
                                setIsDeleteModalOpen(true);
                              }}
                              className="cursor-pointer text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
              <div className="flex justify-between items-center p-2 sm:p-4 bg-white border-t">
                {/* Limit Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-sm text-gray-600">
                    Rows per page:
                  </span>
                  <select
                    className="border rounded px-2 py-1 text-xs sm:text-sm"
                    value={limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 text-xs sm:text-sm border rounded 
                ${page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                      }
            `}
                  >
                    Prev
                  </button>

                  <span className="text-xs sm:text-sm text-gray-700">
                    Page <strong>{page}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 text-xs sm:text-sm border rounded 
                ${page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                      }
            `}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // No Data Message
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="p-16 text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1 3-3V7a2 2 0 0 1 2-2h4l2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                  />
                </svg>

                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No cards found
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        count={deleteMode === "bulk" ? selectedCardIds.length : 1}
        entity="card"
        itemName={cardToDelete?.message || "this card"}
      />
      <ViewCardModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        card={viewCard}
      />
      {isStatusChangeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Status Change
              </h3>
              <button
                onClick={handleCloseStatusModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to change the card status?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {statusChangeData.currentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Status:</span>
                  <span className="text-sm font-semibold text-indigo-600 capitalize">
                    {statusChangeData.newStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCloseStatusModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={handleClosePrintPreview}
        card={cardToPrint}
      />

    </div>
  );
};

export default AdminManageCards;
