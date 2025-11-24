import React, { useState, useRef } from 'react';
// Import Lucide icons
import { Trash2, Filter, Download, Plus, ChevronDown, ArrowUpDown } from 'lucide-react';
import StudentModal from '../Modals/StudentAddModal';
import ConfirmationModal from '../Modals/deleteModal';

const studentData = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@university.edu', phone: '555-0101', status: 'Active' },
    { id: 2, name: 'Bob Williams', email: 'bob.w@university.edu', phone: '555-0102', status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@university.edu', phone: '', status: 'Active' },
    { id: 4, name: 'Diana Prince', email: 'diana.p@university.edu', phone: '555-0104', status: 'Active' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan.h@university.edu', phone: '555-0105', status: 'Inactive' },
    { id: 6, name: 'Alice Johnson', email: 'alice.j@university.edu', phone: '555-0101', status: 'Active' },
    { id: 7, name: 'Bob Williams', email: 'bob.w@university.edu', phone: '555-0102', status: 'Inactive' },
    { id: 8, name: 'Charlie Brown', email: 'charlie.b@university.edu', phone: '555-0103', status: 'Active' },
    { id: 9, name: 'Diana Prince', email: 'diana.p@university.edu', phone: '555-0104', status: 'Active' },
   
];

const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    const color = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const dotColor = isActive ? 'bg-green-500' : 'bg-red-500';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${dotColor}`}></span>
            {status}
        </span>
    );
};

const ManageStudents = () => {

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

      const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null); // For single delete
    const [isBulkDelete, setIsBulkDelete] = useState(false); // For bulk delete


    const isAllSelected = selectedStudentIds.length === studentData.length && studentData.length > 0;
    const isAnySelected = selectedStudentIds.length > 0;

    // Handler to select/deselect all students
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudentIds(studentData.map((student) => student.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

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

    const openModalForAdd = () => {
        setCurrentStudent(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (student) => {
        setCurrentStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStudent(null);
    };

    const handleSave = () => {

    }

    // --- Delete Modal Handlers ---
    const openDeleteModalForSingle = (student) => {
        setIsBulkDelete(false);
setStudentToDelete(student);   // set BEFORE opening modal
setIsDeleteModalOpen(true);
    };

    const openDeleteModalForBulk = () => {
        if (!isAnySelected) return;
        setStudentToDelete(null); // Clear single item reference
        setIsBulkDelete(true);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        setIsBulkDelete(false);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
           
        } else if (studentToDelete) {
           
        }
        closeDeleteModal();
    };
    


    return (
        <div className="min-h-screen mt-16 ml-56 font-[Inter] bg-gray-50 p-4 sm:p-8 ">
            <div className="max-w-8xl">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Student's List
                        <span className="text-sm text-gray-500 font-normal ml-3">
                            {studentData.length} Students
                        </span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Action Buttons Group */}
                        <div className="flex space-x-3 w-full sm:w-auto">

                            <button                                   
                              onClick={openDeleteModalForBulk}
                                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-red-50 hover:text-red-600'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                aria-label="Delete Selected"
                                disabled={!isAnySelected}
                            >
                                Delete({selectedStudentIds.length})
                                <Trash2 className="h-5 w-5 ml-2" />
                            </button>

                            {/* Filters Button (Always active) */}
                            <button
                                className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Filters
                                <Filter className="h-4 w-4 ml-2" />
                            </button>

                            {/* Export Button - Disabled when no students are selected */}
                            <button
                                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                disabled={!isAnySelected}
                            >
                                Export
                                <Download className="h-4 w-4 ml-2" />
                            </button>
                        </div>

                        {/* Add New Student Button (Always active) */}
                        <button
                        onClick={openModalForAdd}
                            className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition duration-150 "
                        >
                            <Plus className="h-5 w-5 mr-2 -ml-1" />
                            Add New Student
                        </button>
                    </div>
                </div>

                {/* Table/List Container */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {studentData.length > 0 ? (

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Name <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Email <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Phone Number <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Status <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Reviews <ArrowUpDown size={14} />
                                            </div>
                                        </th> */}
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Action <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentData.map((student) => (
                                        <tr
                                            key={student.id}
                                            className={`transition duration-150 ${selectedStudentIds.includes(student.id) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap w-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => handleSelectStudent(student.id)}
                                                    className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>

                                            {/* Name Column (Bold Text) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.name || 'N/A'}
                                            </td>

                                            {/* Email Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.email || 'N/A'}
                                            </td>

                                            {/* Phone Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.phone || 'N/A'}
                                            </td>

                                            {/* Status Column (Badge) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={student.status} />
                                            </td>

                                            {/* Reviews/Count Column (View Button) */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                    View ({student.reviews})
                                                </button>
                                            </td> */}

                                            {/* Action Column (View, Edit, Delete) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button className="cursor-pointer text-blue-600 hover:text-blue-900">
                                                    View
                                                </button>
                                                <button
                                                onClick={() => openModalForEdit(student)}
                                                className="cursor-pointer text-yellow-600 hover:text-yellow-900">
                                                    Edit
                                                </button>
                                                <button 
                                                onClick={() => openDeleteModalForSingle(student)}
                                                className="cursor-pointer text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
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

                                <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding a new student using the "Add New Student" button.
                                </p>
                            </div>
                        </div>

                    )}
                </div>

            </div>
            <StudentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                student={currentStudent}
                onSave={handleSave}
            />
            <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={closeDeleteModal}
    onConfirm={confirmDelete}
    count={isBulkDelete ? selectedStudentIds.length : 1}
    entity="student"
    itemName={studentToDelete?.name}
/>
        </div>
    );
};

export default ManageStudents;