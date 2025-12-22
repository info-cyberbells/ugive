import React, { useEffect, useState } from "react";
import { Trash2, Filter, Download, Plus, ArrowUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createStudentByAdmin, getAllStudentsAdmin, resetStudentDetails, updateStudentByAdmin, deleteStudentByAdmin } from "../../../features/adminStudentSlice";
import StudentAdminModal from "../AdminModals/StudentAdminModal";
import { useToast } from "../../../context/ToastContext";
import ConfirmationModal from "../AdminModals/DeleteModalAdmin";

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";
  const color = isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
  const dotColor = isActive ? "bg-green-500" : "bg-red-500";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

const AdminManageStudents = () => {
  const dispatch = useDispatch();
  const {showToast} = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("add"); 
const [selectedStudent, setSelectedStudent] = useState(null);

const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null); 
const [isBulkDelete, setIsBulkDelete] = useState(false);



  const { studentList, page, limit, totalStudents,totalPages, isLoading, isError } = useSelector(
    (state) => state.adminStudents
  );

  useEffect(() => {
    dispatch(getAllStudentsAdmin({ page, limit }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages) return;
  dispatch(getAllStudentsAdmin({ page: newPage, limit }));
};

const handleLimitChange = (newLimit) => {
  dispatch(getAllStudentsAdmin({ page: 1, limit: Number(newLimit) }));
};


  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const data = studentList;

  const isAllSelected =
    selectedStudentIds.length === data.length && data.length > 0;
  const isAnySelected = selectedStudentIds.length > 0;

  // Function to safely display data or 'N/A' if not available
  const displayData = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "N/A";
  };

  const openAddModal = () => {
  setModalMode("add");
  setSelectedStudent(null);
  setIsModalOpen(true);
};

const openViewModal = (student) => {
    setModalMode("view");
    setSelectedStudent(student._id);
    setIsModalOpen(true);
};

const openEditModal = (student) => {
  setModalMode("edit");
  setSelectedStudent(student._id);
  setIsModalOpen(true);
};

const closeModal = () => {
      dispatch(resetStudentDetails());
  setIsModalOpen(false);
  setSelectedStudent(null);
};


  // Handler to select/deselect all students
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(data.map((student) => student._id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Handler to select/deselect a single student
  const handleSelectStudent = (id) => {
    setSelectedStudentIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Deselect
        return prevSelected.filter((studentId) => studentId !== id);
      } else {
        // Select
        return [...prevSelected, id];
      }
    });
  };



  // handle add student
  const handleSaveStudent = (payload) => {
  // EDIT
  if (modalMode === "edit") {
    dispatch(
      updateStudentByAdmin({
        studentId: selectedStudent,
        studentData: payload,
      })
    )
      .unwrap()
      .then(() => {
        showToast("Student updated successfully", "success");
        dispatch(getAllStudentsAdmin({ page, limit }));
      })
      .catch((err) =>
        showToast(err || "Failed to update student", "error")
      );
    return;
  }

  // ADD
  dispatch(createStudentByAdmin(payload))
    .unwrap()
    .then(() => {
      showToast("Student saved successfully", "success");
      dispatch(getAllStudentsAdmin({ page, limit }));
    })
    .catch((err) =>
      showToast(err || "Failed to save student", "error")
    );
};

const openSingleDelete = (student) => {
  setDeleteTarget(student);
  setIsBulkDelete(false);
  setIsConfirmOpen(true);
};

const openBulkDelete = () => {
  setDeleteTarget(null);
  setIsBulkDelete(true);
  setIsConfirmOpen(true);
};


const handleConfirmDelete = () => {
  // BULK DELETE
  if (isBulkDelete) {
    Promise.all(
      selectedStudentIds.map((id) =>
        dispatch(deleteStudentByAdmin(id)).unwrap()
      )
    )
      .then(() => {
        showToast(
          `${selectedStudentIds.length} students deleted successfully`,
          "success"
        );
        setSelectedStudentIds([]);
      })
      .catch((err) => {
        showToast(err || "Failed to delete students", "error");
      })
      .finally(() => setIsConfirmOpen(false));

    return;
  }

  // SINGLE DELETE
  dispatch(deleteStudentByAdmin(deleteTarget._id))
    .unwrap()
    .then(() => {
      showToast("Student deleted successfully", "success");
    })
    .catch((err) => {
      showToast(err || "Failed to delete student", "error");
    })
    .finally(() => setIsConfirmOpen(false));
};





  
 const TableSkeleton = () => (
  <>
    <thead>
      <tr className="bg-gray-50 animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
          <th key={i} 
      className={`px-6 py-3 ${i >= 2 ? "hidden md:table-cell" : ""}`}
          >
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
          <td className="px-6 py-4 hidden md:table-cell">
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </td>
          <td className="px-6 py-4 hidden md:table-cell">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </td>
          <td className="px-6 py-4 hidden lg:table-cell">
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </td>
          <td className="px-6 py-4 hidden md:table-cell">
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
          Error: {typeof message === "string" ? message : "Failed to load students"}
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
            Student's List
            <span className="text-sm text-gray-500 font-normal ml-3">
              {totalStudents} Students
            </span>
          </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
            {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">
              {/* Delete Button */}
              <button

              onClick={openBulkDelete}
                className={`flex items-center cursor-pointer px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${
                  isAnySelected
                    ? "text-gray-700 bg-white hover:bg-red-50 hover:text-red-600"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                }`}
                aria-label="Delete Selected"
                disabled={!isAnySelected}
              >
                Delete ({selectedStudentIds.length})
                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
              </button>

              {/* Export Button */}
              <button
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
              <button
                onClick={openAddModal}
              className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6955A5] hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 border border-transparent rounded-lg  shadow-md">
                <Plus className="h-5 w-5 mr-2 -ml-1 hidden sm:inline" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading || data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 ">
                {isLoading ? (<TableSkeleton />) : ( <> 
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Name</div>
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Email</div>
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 hidden sm:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">College</div>
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Streaks</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Cards Sent</div>
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Phone Number</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student UID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">Actions</div>
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((student) => (
                    <tr
                      key={student._id}
                      className={`transition duration-150 ${
                        selectedStudentIds.includes(student._id)
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Individual Selection Checkbox */}
                      <td className="px-2 sm:px-6 sm:py-4 whitespace-nowrap w-4">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(student._id)}
                          onChange={() => handleSelectStudent(student._id)}
                          className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>

                      {/* Name Column (Bold Text) */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {displayData(student.name)}
                      </td>

                      {/* Email Column */}
                      {/* <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {displayData(student.email) || "N/A"}
                      </td> */}
                      <td className="px-6 py-4 hidden sm:table-cell  whitespace-nowrap text-sm text-gray-600">
                        {student.college ? student.college.name : "N/A"}
                      </td>

                      {/* Phone Column */}
                      {/* <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {displayData(student.streaks) || "N/A"}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                        {displayData(student.sentCards) || "N/A"}
                      </td> */}

                      {/* Status Column (Badge) */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm">
                        {/* <StatusBadge
                          status={student.isDeleted ? "Inactive" : "Active"}
                        />{" "} */}
                        {student.phoneNumber || "-"}
                      </td>

                      {/* Action Column (Static buttons for context) */}
                      <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm font-medium space-x-3">
                        {displayData(student.studentUniId) || "N/A"}
                      </td>

                      <td className="px-6 py-4 space-x-2 whitespace-nowrap text-sm">
                            {/* <StatusBadge status={college.status} /> */}
                            <button
                                onClick={() => openViewModal(student)}
                              className="cursor-pointer text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <button
                                 onClick={() => openEditModal(student)}
                              className="cursor-pointer text-yellow-600 hover:text-yellow-900"
                            >
                              Edit
                            </button>
                            <button
                                onClick={() => openSingleDelete(student)}
                              className="cursor-pointer text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                    </tr>
                  ))}
                </tbody>
                </>)}
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
                  No students found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Displaying student list data only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
        <StudentAdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        studentId={selectedStudent}
        onSave={handleSaveStudent}
        />
        <ConfirmationModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleConfirmDelete}
  count={isBulkDelete ? selectedStudentIds.length : 1}
  entity="student"
  itemName={deleteTarget?.name || ""}
/>

    </div>
  );
};

export default AdminManageStudents;
