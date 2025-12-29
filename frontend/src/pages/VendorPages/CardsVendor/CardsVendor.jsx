import React, { useEffect, useState } from "react";
import { Trash2, Filter, Download, Plus, ArrowUpDown, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ViewCardModal from "../ModalsVendor/ViewPrintedCard";
import { useToast } from "../../../context/ToastContext";
import {
  getPrintedCards,
  updateCardStatusByVendor,
} from "../../../features/vendorCardSlice";

const CardsVendor = () => {
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewCard, setViewCard] = useState(null);

  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({
    id: null,
    currentStatus: "",
    newStatus: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("single");
  const [cardToDelete, setCardToDelete] = useState(null);

  const {
    printedCards,
    isLoading,
    page,
    isError,
    isSuccess,
    limit,
    total,
    totalPages,
    message,
  } = useSelector((state) => state.vendorCards);

  useEffect(() => {
    dispatch(getPrintedCards({ page, limit }));
  }, [dispatch]);

  const data = printedCards || [];

  const isAllSelected =
    selectedCardIds.length === data.length && data.length > 0;
  const isAnySelected = selectedCardIds.length > 0;

  // const handleStatusChange = (id, status) => {
  //   dispatch(updateCardStatusByVendor({ id, status }));
  // };

  const handleConfirmDelete = async () => {};

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(getPrintedCards({ page: newPage, limit }));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(
      getPrintedCards({
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

  const handleStatusChange = (id, newStatus, currentStatus) => {
    if (currentStatus === "printed" && newStatus === "delivered") {
      setStatusChangeData({ id, currentStatus, newStatus });
      setIsStatusChangeModalOpen(true);
      return;
    }
    dispatch(updateCardStatusByVendor({ id, status: newStatus }));
  };

  const handleConfirmStatusChange = () => {
    dispatch(
      updateCardStatusByVendor({
        id: statusChangeData.id,
        status: statusChangeData.newStatus,
      })
    );
    setIsStatusChangeModalOpen(false);
  };

  const handleCloseStatusModal = () => {
    setIsStatusChangeModalOpen(false);
  };

  const handleExport = () => {
    const selected = data.filter((card) => selectedCardIds.includes(card._id));

    if (selected.length === 0) {
      showToast("No Reward selected!", "error");
      return;
    }

    const headers = [
      "Sender Name",
      "Sender Email",
      "Recipient Name",
      "Recipient Email",
      "Reward",
      "College",
      "Status",
      "Message",
      "Sent At",
    ];

    const rows = selected.map((card) => [
      card.sender_name,
      card.sender?.email || "",
      `${card.recipient_name}${
        card.recipient_last_name ? ` ${card.recipient_last_name}` : ""
      }`,
      card.recipient_email,
      card.reward?.name || "",
      card.college_name || "",
      card.status,
      card.message || "",
      new Date(card.sent_at).toLocaleString(),
    ]);

    // Fix CSV — wrap values in quotes to prevent merging
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
    link.href = encodedUri;
    link.download = "sent_card.csv";
    document.body.appendChild(link);
    link.click();

    showToast("CSV exported successfully!", "success");
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
              {total || 0} cards
            </span>
          </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
            {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">

              {/* Export Button */}
              <button
                onClick={handleExport}
                className={`flex items-center justify-center cursor-pointer px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-gray-50"
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Print Status
                        </th>

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
                          className={`transition duration-150 ${
                            selectedCardIds.includes(card._id)
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

                          {/* Print Status */}
                          <td className=" sm:px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={card.status}
                              disabled={card.status === "delivered"}
                              onChange={(e) =>
                                handleStatusChange(
                                  card._id,
                                  e.target.value,
                                  card.status
                                )
                              }
                              className={`px-2 py-1 border rounded-md text-sm bg-white focus:outline-none focus:ring-1
    ${
      card.status === "delivered"
        ? "cursor-not-allowed bg-gray-100 text-gray-500"
        : "focus:ring-indigo-500"
    }`}
                            >
                              <option value="printed" disabled>
                                Printed
                              </option>
                              <option value="delivered">Delivered</option>
                            </select>
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

                            {/* <button
                          onClick={() => {
                            setDeleteMode("single");
                            setCardToDelete(card);
                            setIsDeleteModalOpen(true);
                          }}
                          className="cursor-pointer text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button> */}
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
                  <span className="text-xs sm:text-sm text-gray-600">
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
                ${
                  page === 1
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
                ${
                  page === totalPages
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
      <ViewCardModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        card={viewCard}
      />
      {isStatusChangeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Confirm Status Change</h3>
              <button onClick={handleCloseStatusModal}>
                <X className="w-5 h-5 cursor-pointer text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to mark this card as <b>Delivered</b>?
              </p>
              <div className="flex justify-between text-sm">
                <span>Current:</span>
                <span className="font-semibold capitalize">
                  {statusChangeData.currentStatus}
                </span>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCloseStatusModal}
                className="flex-1 cursor-pointer border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="flex-1 cursor-pointer bg-indigo-600 text-white rounded-lg py-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsVendor;
