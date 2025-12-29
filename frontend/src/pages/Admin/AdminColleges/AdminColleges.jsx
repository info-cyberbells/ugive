import React, { useEffect, useState } from "react";
import { Trash2, Filter, Download, Plus, ArrowUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCollegeByAdmin,
  getAdminColleges,
  resetSingleCollege,
  viewSingleCollegebyAdmin,
} from "../../../features/adminCollegesSlice";
import CollegeModal from "../AdminModals/CollegeModal";
import ConfirmationModal from "../AdminModals/DeleteModalAdmin";
import { useToast } from "../../../context/ToastContext";

const AdminColleges = () => {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const { adminColleges, isLoading, totalPages, isError, singleCollege } =
    useSelector((state) => state.adminColleges);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentCollege, setCurrentCollege] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("single");
  const [collegeToDelete, setCollegeToDelete] = useState(null);

  const [selectedCollegeIds, setSelectedCollegeIds] = useState([]);
  const data = adminColleges;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const isAllSelected =
    selectedCollegeIds.length === data.length && data.length > 0;
  const isAnySelected = selectedCollegeIds.length > 0;

  useEffect(() => {
    dispatch(getAdminColleges({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  // Function to safely display data or 'N/A' if not available
  const displayData = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "N/A";
  };

  // Handler to select/deselect all colleges
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCollegeIds(data.map((college) => college._id));
    } else {
      setSelectedCollegeIds([]);
    }
  };

  // Handler to select/deselect a single college
  const handleSelectcollege = (id) => {
    setSelectedCollegeIds((prev) =>
      prev.includes(id)
        ? prev.filter((collegeId) => collegeId !== id)
        : [...prev, id]
    );
  };

  const openDeleteModalForSingle = (college) => {
    setDeleteMode("single");
    setCollegeToDelete(college);
    setIsDeleteModalOpen(true);
  };

  const openDeleteModalForBulk = () => {
    setDeleteMode("bulk");
    setCollegeToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCollegeToDelete(null);
    setSelectedCollegeIds([]);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteMode === "single") {
        if (!collegeToDelete?._id) {
          showToast("Invalid college selected", "error");
          return;
        }

        await dispatch(deleteCollegeByAdmin(collegeToDelete._id)).unwrap();
        showToast("College deleted successfully", "success");
      }

      if (deleteMode === "bulk") {
        if (selectedCollegeIds.length === 0) {
          showToast("No colleges selected", "error");
          return;
        }

        await Promise.all(
          selectedCollegeIds.map((id) =>
            dispatch(deleteCollegeByAdmin(id)).unwrap()
          )
        );

        showToast(
          `${selectedCollegeIds.length} colleges deleted successfully`,
          "success"
        );
      }

      setSelectedCollegeIds([]);
      setCollegeToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      showToast(
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete college",
        "error"
      );
    }
  };

  const openModalForAdd = () => {
    setCurrentCollege(null);
    setIsViewMode(false);
    dispatch(resetSingleCollege());
    setIsModalOpen(true);
  };

  const openModalForView = (college) => {
    setIsViewMode(true);
    setIsModalOpen(true);
    dispatch(viewSingleCollegebyAdmin(college._id));
  };

  const openModalForEdit = (college) => {
    setCurrentCollege(college);
    setIsViewMode(false);
    dispatch(viewSingleCollegebyAdmin(college._id));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    dispatch(resetSingleCollege());
    setIsModalOpen(false);
    setCurrentCollege(null);
  };

const handleExport = () => {
  const selected =
    selectedCollegeIds.length > 0
      ? data.filter((college) =>
          selectedCollegeIds.includes(college._id)
        )
      : data;

  if (selected.length === 0) {
    showToast("No College selected!", "error");
    return;
  }

  const headers = [
    "Name",
    "Phone Number",
    "University Name",
    "Address",
    "City",
    "State",
    "Post Code",
  ];

  const rows = selected.map((college) => [
    college.name || "N/A",
    college.phoneNumber || "N/A",
    college.university?.name || "N/A",
    college.address_line_1 || "N/A",
    college.city || "N/A",
    college.state || "N/A",
    college.postcode || "N/A",
  ]);

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvString =
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

  const blob = new Blob([csvString], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "adminColleges.csv";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast("CSV exported successfully!", "success");
};



  const TableSkeleton = () => (
    <>
      {/* Header Skeleton */}
      <thead>
        <tr className="bg-gray-50 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </th>
          ))}
        </tr>
      </thead>

      {/* Body Skeleton */}
      <tbody className="bg-white divide-y divide-gray-200 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i}>
            <td className="px-6 py-4">
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
              <div className="flex gap-2">
                <div className="h-4 w-10 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
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
          Error: Failed to load colleges
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
            College's List
            <span className="text-sm text-gray-500 font-normal ml-3">
              {data.length} Colleges
            </span>
          </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
            {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">
              {/* Delete Button */}
              <button
                onClick={openDeleteModalForBulk}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${
                  isAnySelected
                    ? "text-gray-700 bg-white cursor-pointer hover:bg-red-50 hover:text-red-600"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                aria-label="Delete Selected"
                disabled={!isAnySelected}
              >
                Delete ({selectedCollegeIds.length})
                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
              </button>

              {/* Export Button */}
              <button
              onClick={handleExport}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
              </button>
              <button
                onClick={openModalForAdd}
                className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6955A5] border border-transparent rounded-lg hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 shadow-md"
              >
                <Plus className="h-5 w-5 mr-2 -ml-1 hidden sm:inline" />
                Add New
              </button>
            </div>

            {/* Static Add New college Button */}
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
                          className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </th>

                        <th
                          scope="col"
                          className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">Name</div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            University Name
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            College City
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            Post Code
                          </div>
                        </th>
                        <th
                          scope="col"
                          className=" px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">Actions</div>
                        </th>
                        {/* <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((college) => (
                        <tr
                          key={college._id}
                          className={`transition duration-150 ${
                            selectedCollegeIds.includes(college._id)
                              ? "bg-indigo-50 hover:bg-indigo-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {/* Individual Selection Checkbox */}
                          <td className="px-2 sm:px-6 sm:py-4 whitespace-nowrap w-4">
                            <input
                              type="checkbox"
                              checked={selectedCollegeIds.includes(college._id)}
                              onChange={() => handleSelectcollege(college._id)}
                              className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </td>

                          {/* Name Column (Bold Text) */}
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {displayData(college.name) || "N/A"}
                          </td>

                          {/* Email Column */}
                          <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                            {displayData(college.university?.name) || "N/A"}
                          </td>

                          {/* Phone Column */}
                          <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                            {displayData(college.city) || "N/A"}
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                            {displayData(college.postcode) || "N/A"}
                          </td>

                          <td className="px-6 py-4 space-x-2 whitespace-nowrap text-sm">
                            {/* <StatusBadge status={college.status} /> */}
                            <button
                              onClick={() => openModalForView(college)}
                              className="cursor-pointer text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openModalForEdit(college)}
                              className="cursor-pointer text-yellow-600 hover:text-yellow-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModalForSingle(college)}
                              className="cursor-pointer text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>

                          {/* <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm font-medium space-x-3">
                                               {displayData(college.rewardUnlocked) || "N/A"}
                                            </td> */}
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
                  No colleges found
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <CollegeModal
          isOpen={isModalOpen}
          mode={isViewMode ? "view" : currentCollege ? "edit" : "add"} // Fix: check currentCollege
          initialData={singleCollege}
          onClose={closeModal}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          count={deleteMode === "bulk" ? selectedCollegeIds.length : 1}
          entity="college"
          itemName={deleteMode === "single" ? collegeToDelete?.name : ""}
        />
      )}
    </div>
  );
};

export default AdminColleges;
