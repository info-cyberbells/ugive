import React, { useEffect, useState } from "react";
import {
  Trash2,
  Filter,
  Download,
  Plus,
  
} from "lucide-react";
import VendorModal from "../Modals/VendorModal";
import ConfirmationModal from "../Modals/deleteModal";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../context/ToastContext";
import {
  createVendorBySuperAdmin,
  deleteVendorBySuperAdmin,
  getAllVendorsBySuperAdmin,
  getSingleVendorBySuperAdmin,
  updateVendorBySuperAdmin,
} from "../../../features/superadminVendors";



const ManageVendors = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const {
    vendorsList,
    isLoading,
    isError,
    totalPages,
    limit,
    page,
    totalVendors,
    singleVendor,
  } = useSelector((state) => state.superadminVendors);

  const [modalMode, setModalMode] = useState("add"); // add | view | edit

  const [selectedVendorIds, setSelectedVendorIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    dispatch(getAllVendorsBySuperAdmin({ limit, page }));
  }, [dispatch]);

  const data = vendorsList || [];

  const isAllSelected =
    data.length > 0 && selectedVendorIds.length === data.length;
  const isAnySelected = selectedVendorIds.length > 0;

  const handleLimitChange = (newLimit) => {
    dispatch(getAllVendorsBySuperAdmin({ page: 1, limit: Number(newLimit) }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(getAllVendorsBySuperAdmin({ page: newPage, limit }));
  };

  // Handler to select/deselect all admin
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVendorIds(data.map((admin) => admin._id));
    } else {
      setSelectedVendorIds([]);
    }
  };

  // Handler to select/deselect a single college
  const handleSelectVendor = (id) => {
    setSelectedVendorIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Deselect
        return prevSelected.filter((adminId) => adminId !== id);
      } else {
        // Select
        return [...prevSelected, id];
      }
    });
  };

  const openModalForAdd = () => {
    setModalMode("add");
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVendorIds([]);
    setModalMode(null);
  };

  const handleSave = async (payload) => {
    try {
      if (modalMode === "edit") {
        await dispatch(
          updateVendorBySuperAdmin({
            id: singleVendor._id,
            payload,
          })
        ).unwrap();
        dispatch(getAllVendorsBySuperAdmin({page, limit}));
        showToast("Vendor updated successfully", "success");
      } else {
        await dispatch(createVendorBySuperAdmin(payload)).unwrap();
        showToast("Vendor created successfully", "success");
        dispatch(getAllVendorsBySuperAdmin({page, limit}));
      }

      closeModal();
    } catch (err) {
      showToast(err || "Operation failed", "error");
    }
  };

  // --- Delete Modal Handlers ---
  const openDeleteModalForSingle = (vendor) => {
    setVendorToDelete(vendor);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const openDeleteModalForBulk = () => {
    if (!isAnySelected) return;
    setVendorToDelete(null);
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVendorToDelete(null);
    setIsBulkDelete(false);
  };

  const confirmDelete = async () => {
  try {
    if (isBulkDelete) {
      await Promise.all(
        selectedVendorIds.map((id) =>
          dispatch(deleteVendorBySuperAdmin(id)).unwrap()
        )
      );
      setSelectedVendorIds([]);
      showToast("Selected vendors deleted successfully!", "success");
    } else if (vendorToDelete) {
      await dispatch(
        deleteVendorBySuperAdmin(vendorToDelete._id)
      ).unwrap();

      showToast("Vendor deleted successfully!", "success");
    }
  } catch (err) {
    showToast(err || "Failed to delete vendor", "error");
  } finally {
    closeDeleteModal();
  }
};


const handleExportCSV = () => {
  const selected = data.filter((vendor) => selectedVendorIds.includes(vendor._id));

  if (selected.length === 0) {
    showToast("No vendors selected!", "error");
    return;
  }

  const headers = [
    "Vendor Name",
    "Email",
    "Phone Number",
    "University Name",
    "Colleges",

  ];

  const rows = selected.map((vendor) => [
    vendor.name,
    vendor.email,
    vendor.phoneNumber,
    vendor.university?.name || "",
    vendor.colleges?.map(college => college.name).join("; ") || "",

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
  link.setAttribute("download", `vendors_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`${selected.length} vendor(s) exported successfully!`, "success");
};

  
  const SkeletonTable = () => {
    return (
      <div className="animate-pulse p-4">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {[...Array(6)].map((_, i) => (
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
    <div className="min-h-screen mt-12 lg:mt-14 lg:ml-56 font-[Inter] bg-gray-50 px-1 py-4 md:p-4 lg:p-8">
      <div className="max-w-8xl ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
            Vendor's List
            <span className="text-sm text-gray-500 font-normal ml-3">
              {totalVendors || 0} Vendors
            </span>
          </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
            {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={openDeleteModalForBulk}
                className={`flex cursor-pointer items-center px-6 sm:px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-red-50 hover:text-red-600"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                aria-label="Delete Selected"
                disabled={!isAnySelected}
              >
                Delete({selectedVendorIds.length})
                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
              </button>

              {/* Filters Button (Always active) */}
              {/* <button className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm">
                Filters
                <Filter className="h-4 w-4 ml-2" />
              </button> */}

              {/* Export Button - Disabled when no colleges are selected */}
              <button
                onClick={handleExportCSV}
                className={`flex cursor-pointer items-center px-10 sm:px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-gray-50"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                disabled={!isAnySelected}
              >
                Export
                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
              </button>

              {/* Add New Admin Button (Always active) */}
              <button
                onClick={openModalForAdd}
                className="flex cursor-pointer items-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                <Plus className="h-5 w-5 mr-2 -ml-1 hidden sm:inline" />
                Add New Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading || (data.length === 0 && !isError) ? (
            <SkeletonTable />
          ) : data && data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead>
                    <tr className="bg-gray-50">
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
                        className="sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">Name</div>
                      </th>
                      <th
                        scope="col"
                        className="hidden lg:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          University Name
                        </div>
                      </th>
                      {/* <th
                        scope="col"
                        className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">Email</div>
                      </th> */}
                      
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      >
                        <div className="flex items-center gap-1">
                          Phone Number
                        </div>
                      </th>
                    
                      <th
                        scope="col"
                        className="sm:px-6 py-1 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((vendor) => (
                      <tr
                        key={vendor._id}
                        className={`transition duration-150 ${
                          selectedVendorIds.includes(vendor._id)
                            ? "bg-indigo-50 hover:bg-indigo-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedVendorIds.includes(vendor._id)}
                            onChange={() => handleSelectVendor(vendor._id)}
                            className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>

                        {/*  Name Column */}
                        <td className="sm:px-6 py-1 sm:py-4 whitespace-nowrap text-xs sm:text-sm sm:font-medium text-gray-900">
                          {vendor.name || "N/A"}
                        </td>

                        {/* University ID Column */}
                        <td className="hidden lg:table-cell sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                          {vendor.university.name || "N/A"}
                        </td>

                        {/* Address Line 1 Column */}
                        {/* <td className="hidden lg:table-cell sm:px-6 sm:py-4 text-sm text-gray-600 max-w-[200px] whitespace-normal break-words">
                          {vendor.email || "N/A"}
                        </td> */}

                        {/* State Column */}
                        <td className="hidden sm:table-cell sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                          {vendor.phoneNumber || "N/A"}
                        </td>

                        {/* Action Column (View, Edit, Delete) */}
                        <td className="sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-3">
                          <button
                            onClick={async () => {
                              try {
                                const res = await dispatch(
                                  getSingleVendorBySuperAdmin(vendor._id)
                                ).unwrap();

                                setModalMode("view");
                                setIsModalOpen(true);
                              } catch (err) {
                                showToast(
                                  err || "Failed to load vendor details",
                                  "error"
                                );
                              }
                            }}
                            className="cursor-pointer text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await dispatch(
                                  getSingleVendorBySuperAdmin(vendor._id)
                                ).unwrap();
                                setModalMode("edit");
                                setIsModalOpen(true);
                              } catch (err) {
                                showToast(
                                  err || "Failed to load vendor",
                                  "error"
                                );
                              }
                            }}
                            className="cursor-pointer text-yellow-600 hover:text-yellow-900"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModalForSingle(vendor)}
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
            </>
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
                  No Vendor found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new vendor using the "Add New Vendor"
                  button.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <VendorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        initialData={singleVendor}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={isBulkDelete ? selectedVendorIds.length : 1}
        entity="vendor"
        itemName={vendorToDelete?.name}
      />
    </div>
  );
};

export default ManageVendors;
