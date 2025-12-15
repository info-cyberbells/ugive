import React, { useState } from "react";
// Import Lucide icons
import { Trash2, Filter, Download, Plus, ArrowUpDown } from "lucide-react";

// Initial Dummy data for  cards
const cardData = [
  {
    id: 1,
    senderName: "Mark",
    receiverName: "John",
    timeSent: "1",
    cardId: "2",
    printStatus: "Active",
    deliveryStatus: "Pending",
    description: "A Gift from Me",
  },
  {
    id: 2,
    senderName: "Anna",
    receiverName: "Emily",
    timeSent: "3",
    cardId: "5",
    printStatus: "Completed",
    deliveryStatus: "Delivered",
    description: "Thanks for your help!",
  },
  {
    id: 3,
    senderName: "David",
    receiverName: "Chris",
    timeSent: "1",
    cardId: "7",
    printStatus: "Active",
    deliveryStatus: "In Transit",
    description: "You did an amazing job!",
  },
  {
    id: 4,
    senderName: "Sophia",
    receiverName: "Liam",
    timeSent: "2",
    cardId: "9",
    printStatus: "Completed",
    deliveryStatus: "Delivered",
    description: "Congrats on your achievement",
  },
  {
    id: 5,
    senderName: "James",
    receiverName: "Olivia",
    timeSent: "3",
    cardId: "12",
    printStatus: "Cancelled",
    deliveryStatus: "Cancelled",
    description: "Sorry for the confusion",
  },
  {
    id: 6,
    senderName: "Emma",
    receiverName: "Noah",
    timeSent: "5",
    cardId: "15",
    printStatus: "Active",
    deliveryStatus: "Pending",
    description: "Best wishes always",
  },
];

const getDeliveryBadge = (status) => {
  const base = "px-3 py-1 text-xs font-semibold rounded-full inline-block";

  switch (status) {
    case "Delivered":
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Delivered</span>
      );

    case "In Transit":
      return (
        <span className={`${base} bg-blue-100 text-blue-700`}>In Transit</span>
      );

    case "Pending":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>
      );

    case "Cancelled":
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>
      );

    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>
      );
  }
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-indigo-100 text-indigo-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const AdminManageCards = () => {
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const data = cardData;

  const isAllSelected =
    selectedCardIds.length === data.length && data.length > 0;
  const isAnySelected = selectedCardIds.length > 0;

  // Function to safely display data or 'N/A' if not available
  const displayData = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "N/A";
  };

  // Handler to select/deselect all  cards
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCardIds(data.map((card) => card.id));
    } else {
      setSelectedCardIds([]);
    }
  };

  // Handler to select/deselect a single  card
  const handleSelectCard = (id) => {
    setSelectedCardIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Deselect
        return prevSelected.filter((cardId) => cardId !== id);
      } else {
        // Select
        return [...prevSelected, id];
      }
    });
  };

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
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-red-50 hover:text-red-600"
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
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-gray-50"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
              </button>
            <button className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6955A5] border border-transparent rounded-lg hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 shadow-md">
              <Plus className="h-5 w-5 mr-2 -ml-1 hidden sm:inline" />
              Add New
            </button>
            </div>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead>
                  <tr className="bg-gray-50">
                    {/* Selection Checkbox Header */}
                    <th
                      scope="col"
                      className="px-6 py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Receiver
                    </th>
                    <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Time Sent
                    </th>
                    <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Card ID
                    </th>
                    <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Print Status
                    </th>
                    <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Delivery Status
                    </th>
                    <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((card) => (
                    <tr
                      key={card.id}
                      className={`transition duration-150 ${
                        selectedCardIds.includes(card.id)
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Individual Selection Checkbox */}
                      <td className="px-6 py-4 whitespace-nowrap w-4">
                        <input
                          type="checkbox"
                          checked={selectedCardIds.includes(card.id)}
                          onChange={() => handleSelectCard(card.id)}
                          className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>

                      {/* Name Column (Bold Text) */}
                      {/* Sender Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {card.senderName}
                      </td>

                      {/* Receiver Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {card.receiverName}
                      </td>

                      {/* Time Sent */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {card.timeSent}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {card.cardId || "N/A"}
                      </td>

                      {/* Print Status */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm">
                        <StatusBadge status={card.printStatus} />
                      </td>

                      {/* Delivery Status */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm">
                        {getDeliveryBadge(card.deliveryStatus)}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {card.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
};

export default AdminManageCards;
