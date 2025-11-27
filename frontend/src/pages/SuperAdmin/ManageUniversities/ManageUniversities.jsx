import React, { useEffect, useState } from "react";
import { Trash2, Filter, Download, Plus, ArrowUpDown } from "lucide-react";
import UniversityModal from "../Modals/UniAddModal";
import ConfirmationModal from "../Modals/deleteModal";
import { useDispatch, useSelector } from "react-redux";
import { getUniversitiesData, getSingleUniversity, deleteUniversity } from "../../../features/universitySlice";
import { useToast } from "../../../context/ToastContext";


const ManageUniversities = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUniversity } = useSelector((state) => state.university);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [limit, setLimit] = useState(10);

  const { university, loading, error, page, totalPages } = useSelector(
    (state) => state.university
  );

  useEffect(() => {
    dispatch(getUniversitiesData({ page: 1, limit }));
  }, [dispatch, limit]);

  const [selectedUniversityIds, setSelectedUniversityIds] = useState([]);
  const data = university;

  const isAllSelected =
    data.length > 0 && selectedUniversityIds.length === data.length;
  const isAnySelected = selectedUniversityIds.length > 0;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(getUniversitiesData({ page: newPage, limit }));
  };

  const handleLimitChange = (newLimit) => {
    const newLimitValue = Number(newLimit);
    setLimit(newLimitValue);
  };

  // Handler to select/deselect all universities
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUniversityIds(data.map((uni) => uni._id));
    } else {
      setSelectedUniversityIds([]);
    }
  };

  // Handler to select/deselect a single university
  const handleSelectUniversity = (id) => {
    setSelectedUniversityIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((uniId) => uniId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Modal Handlers
  const openModalForAdd = () => {
    dispatch({ type: 'university/clearCurrentUniversity' });
    setIsViewMode(false);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Logic to save/update data
  const handleSave = (newUniData) => { };

  // --- Delete Modal Handlers ---
  const openDeleteModalForSingle = (student) => {
    setUniversityToDelete(student);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const openDeleteModalForBulk = () => {
    if (!isAnySelected) return;
    setUniversityToDelete(null);
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUniversityToDelete(null);
    setIsBulkDelete(false);
  };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        for (const id of selectedUniversityIds) {
          await dispatch(deleteUniversity(id)).unwrap();
        }
        showToast(`${selectedUniversityIds.length} universities deleted successfully`, "success");
        setSelectedUniversityIds([]);
      } else if (universityToDelete) {
        await dispatch(deleteUniversity(universityToDelete._id)).unwrap();
        showToast("University deleted successfully", "success");
      }
    } catch (error) {
      showToast(error || "Failed to delete", "error");
    }
    closeDeleteModal();
  };


  const handleExportCSV = () => {
    const selected = data.filter((uni) =>
      selectedUniversityIds.includes(uni._id)
    );

    if (selected.length === 0) return;

    const headers = ["Name", "Address Line 1", "City", "State", "Postcode"];

    const rows = selected.map((uni) => [
      uni.name,
      uni.address_line_1,
      uni.city,
      uni.state,
      uni.postcode,
    ]);

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "universities_export.csv");
    document.body.appendChild(link);
    link.click();

    showToast("CSV exported successfully!", "success");
  };


  const SkeletonTable = () => {
    return (
      <div className="animate-pulse p-4">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-4 gap-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>

            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen lg:mt-14 lg:ml-56 font-[Inter] bg-gray-50 p-4 sm:p-8 ">
      <div className="max-w-8xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            University List
            <span className="text-sm text-gray-500 font-normal ml-3">
              {data.length} Universities
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Action Buttons Group */}
            <div className="flex space-x-3 w-full sm:w-auto">
              {/* Delete Button - Disabled when no universities are selected */}
              <button
                onClick={openDeleteModalForBulk}
                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${isAnySelected
                  ? "text-gray-700 bg-white hover:bg-red-50 hover:text-red-600"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                aria-label="Delete Selected"
                disabled={!isAnySelected}
              >
                Delete({selectedUniversityIds.length})
                <Trash2 className="h-5 w-5 ml-2" />
              </button>

              {/* Filters Button (Always active) */}
              {/* <button className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Filters
                <Filter className="h-4 w-4 ml-2" />
              </button> */}

              {/* Export Button - Disabled when no universities are selected */}
              <button
                onClick={handleExportCSV}
                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150  ${isAnySelected
                  ? "text-gray-700 bg-white hover:bg-gray-50"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                  }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2" />
              </button>

            </div>

            {/* Add New University Button (Always active) */}
            <button
              onClick={openModalForAdd}
              className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition duration-150 "
            >
              <Plus className="h-5 w-5 mr-2 -ml-1" />
              Add New University
            </button>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading || data.length === 0 && !error ? (
            <SkeletonTable />
          ) : data && data.length > 0 ? (

            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead>
                    <tr className="bg-gray-50">
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

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          Name
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          Address Line 1
                        </div>
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          Address Line 2 <ArrowUpDown size={14} />
                        </div>
                      </th> */}
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          City
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          State
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          Postcode
                        </div>
                      </th>
                      {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Status <ArrowUpDown size={14} />
                                            </div>
                                        </th> */}
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((uni) => (
                      <tr
                        key={uni._id}
                        className={`transition duration-150 ${selectedUniversityIds.includes(uni.id)
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap w-4">
                          <input
                            type="checkbox"
                            checked={selectedUniversityIds.includes(uni._id)}
                            onChange={() => handleSelectUniversity(uni._id)}
                            className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>

                        {/* Name Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {uni.name || "N/A"}
                        </td>

                        {/* Address Line 1 Column */}
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] whitespace-normal break-words">
                          {uni.address_line_1 || "N/A"}
                        </td>

                        {/* Address Line 2 Column */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {uni.address_line_2 || "N/A"}
                        </td> */}

                        {/* City Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {uni.city || "N/A"}
                        </td>

                        {/* State Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {uni.state || "N/A"}
                        </td>

                        {/* Postcode Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {uni.postcode || "N/A"}
                        </td>

                        {/* Status Column (Badge) */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={uni.status} />
                                            </td> */}

                        {/* Action Column (View, Edit, Delete) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => {
                              dispatch(getSingleUniversity(uni._id));
                              setIsViewMode(true);
                              setIsModalOpen(true);
                            }}
                            className="cursor-pointer text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              dispatch(getSingleUniversity(uni._id));
                              setIsViewMode(false);
                              setIsModalOpen(true);
                            }}
                            className="cursor-pointer text-yellow-600 hover:text-yellow-900"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModalForSingle(uni)}
                            className="cursor-pointer text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination + Limit Controls */}
              <div className="flex justify-between items-center p-4 bg-white border-t">
                {/* Limit Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    className="border rounded px-2 py-1 text-sm"
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
                    className={`px-3 py-1 text-sm border rounded 
                ${page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                      }
            `}
                  >
                    Prev
                  </button>

                  <span className="text-sm text-gray-700">
                    Page <strong>{page}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 text-sm border rounded 
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
            </>
          ) : (
            // No Data Message
            <div className="flex items-center justify-center min-h-[500px]">
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
                  No universities found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new university using the "Add New
                  University" button.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <UniversityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        university={currentUniversity}
        isViewMode={isViewMode}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={isBulkDelete ? selectedUniversityIds.length : 1}
        entity="university"
        itemName={universityToDelete?.name}
      />
    </div>
  );
};

export default ManageUniversities;
