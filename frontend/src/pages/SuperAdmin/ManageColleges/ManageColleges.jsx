import React, { useState } from 'react';
import { Trash2, Filter, Download, Plus, ArrowUpDown, Building2 } from 'lucide-react';
import CollegeModal from '../Modals/CollegeAddModal';
import ConfirmationModal from '../Modals/deleteModal';

// --- DUMMY DATA FOR COLLEGES ---
const collegeData = [
    { id: 101, name: 'College of Arts & Sciences', universityId: 'uni-harvard-001', address_line_1: '54 Oxford St', address_line_2: 'Sever Hall', city: 'Cambridge', state: 'MA', postcode: '02138', status: 'Operational' },
    { id: 102, name: 'School of Engineering', universityId: 'uni-stanford-002', address_line_1: '450 Serra Mall', address_line_2: null, city: 'Stanford', state: 'CA', postcode: '94305', status: 'Operational' },
    { id: 103, name: 'Sloan School of Management', universityId: 'uni-mit-003', address_line_1: '100 Main St', address_line_2: 'Building 54', city: 'Cambridge', state: 'MA', postcode: '02142', status: 'Under Review' },
    { id: 104, name: 'College of Medicine', universityId: 'uni-yale-004', address_line_1: '333 Cedar St', address_line_2: 'Medical Campus', city: 'New Haven', state: 'CT', postcode: '06510', status: 'Operational' },
    { id: 105, name: 'Woodrow Wilson School', universityId: 'uni-princeton-005', address_line_1: 'Princeton Campus', address_line_2: 'Robertson Hall', city: 'Princeton', state: 'NJ', postcode: '08544', status: 'Operational' },
    { id: 106, name: 'Journalism School', universityId: 'uni-columbia-006', address_line_1: '2950 Broadway', address_line_2: 'Pulitzer Hall', city: 'New York', state: 'NY', postcode: '10027', status: 'Operational' },
    { id: 107, name: 'Harris Public Policy', universityId: 'uni-uchicago-007', address_line_1: '1307 E 60th St', address_line_2: null, city: 'Chicago', state: '', postcode: '60637', status: 'Under Review' }, // state is intentionally missing
    { id: 108, name: 'Trinity College', universityId: 'uni-duke-008', address_line_1: 'West Campus', address_line_2: 'Duke Chapel', city: 'Durham', state: 'NC', postcode: '27708', status: 'Operational' },

];

const StatusBadge = ({ status }) => {
    const colorMap = {
        'Operational': 'bg-green-100 text-green-800',
        'Under Review': 'bg-yellow-100 text-yellow-800',
    };
    const dotColorMap = {
        'Operational': 'bg-green-500',
        'Under Review': 'bg-yellow-500',
    };

    const color = colorMap[status] || 'bg-gray-100 text-gray-800';
    const dotColor = dotColorMap[status] || 'bg-gray-500';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${dotColor}`}></span>
            {status}
        </span>
    );
};

const manageColleges = () => {

    const [selectedCollegeIds, setSelectedCollegeIds] = useState([]);
    const data = collegeData;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCollege, setCurrentCollege] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
            const [collegeToDelete, setCollegeToDelete] = useState(null); // For single delete
            const [isBulkDelete, setIsBulkDelete] = useState(false); // For bulk delete
        


    const isAllSelected = selectedCollegeIds.length === data.length && data.length > 0;
    const isAnySelected = selectedCollegeIds.length > 0;

    // Handler to select/deselect all colleges
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCollegeIds(data.map((college) => college.id));
        } else {
            setSelectedCollegeIds([]);
        }
    };

    // Handler to select/deselect a single college
    const handleSelectCollege = (id) => {
        setSelectedCollegeIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                // Deselect
                return prevSelected.filter((collegeId) => collegeId !== id);
            } else {
                // Select
                return [...prevSelected, id];
            }
        });
    };

      const openModalForAdd = () => {
        setCurrentCollege(null);
        setIsModalOpen(true);
    };

    // This handler opens the modal in editable mode
    const openModalForEdit = (college) => {
        setCurrentCollege(college);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCollege(null);
    };

       const handleSave = () => {

    };

     // --- Delete Modal Handlers ---
    const openDeleteModalForSingle = (student) => {
        setCollegeToDelete(student);
        setIsBulkDelete(false);
        setIsDeleteModalOpen(true);
    };

    const openDeleteModalForBulk = () => {
        if (!isAnySelected) return;
        setCollegeToDelete(null); 
        setIsBulkDelete(true);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCollegeToDelete(null);
        setIsBulkDelete(false);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
           
        } else if (universityToDelete) {
           
        }
        closeDeleteModal();
    };



    return (
        <div className="min-h-screen lg:mt-14 lg:ml-56 font-[Inter] bg-gray-50 p-4 sm:p-8 ">
            <div className="max-w-8xl ">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        College List
                        <span className="text-sm text-gray-500 font-normal ml-3">
                            {data.length} Colleges
                        </span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Action Buttons Group */}
                        <div className="flex space-x-3 w-full sm:w-auto">

                            {/* Delete Button - Disabled when no colleges are selected */}
                            <button
                            onClick={openDeleteModalForBulk}
                                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-red-50 hover:text-red-600'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                aria-label="Delete Selected"
                                disabled={!isAnySelected}
                            >
                                Delete({selectedCollegeIds.length})
                                <Trash2 className="h-5 w-5 ml-2" />
                            </button>

                            {/* Filters Button (Always active) */}
                            <button
                                className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                            >
                                Filters
                                <Filter className="h-4 w-4 ml-2" />
                            </button>

                            {/* Export Button - Disabled when no colleges are selected */}
                            <button
                                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                disabled={!isAnySelected}
                            >
                                Export
                                <Download className="h-4 w-4 ml-2" />
                            </button>
                        </div>

                        {/* Add New College Button (Always active) */}
                        <button                                 
                        onClick={openModalForAdd}
                            className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                        >
                            <Plus className="h-5 w-5 mr-2 -ml-1" />
                            Add New College
                        </button>
                    </div>
                </div>

                {/* Table/List Container */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {data.length > 0 ? (

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

                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                College Name <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Uni. ID <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Address Line 1 <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                City <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                State <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Postcode <ArrowUpDown size={14} />
                                            </div>
                                        </th> */}
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Status <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((college) => (
                                        <tr
                                            key={college.id}
                                            className={`transition duration-150 ${selectedCollegeIds.includes(college.id) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap w-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCollegeIds.includes(college.id)}
                                                    onChange={() => handleSelectCollege(college.id)}
                                                    className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>

                                            {/* College Name Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {college.name || 'N/A'}
                                            </td>

                                            {/* University ID Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                                {college.universityId || 'N/A'}
                                            </td>

                                            {/* Address Line 1 Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {college.address_line_1 || 'N/A'}

                                            </td>

                                            {/* City Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {college.city || 'N/A'}
                                            </td>

                                            {/* State Column */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {college.state || 'N/A'}
                                            </td> */}

                                            {/* Postcode Column */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {college.postcode || 'N/A'}
                                            </td> */}

                                            {/* Status Column (Badge) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={college.status} />
                                            </td>


                                            {/* Action Column (View, Edit, Delete) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button className="cursor-pointer text-blue-600 hover:text-blue-900">
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => openModalForEdit(college)}
                                                    className="cursor-pointer text-yellow-600 hover:text-yellow-900">
                                                    Edit
                                                </button>
                                                <button
                                                onClick={()=> openDeleteModalForSingle(college)}
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

                                <h3 className="mt-2 text-lg font-medium text-gray-900">No colleges found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding a new college using the "Add New College" button.
                                </p>
                            </div>
                        </div>

                    )}
                </div>

            </div>
            <CollegeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                college={currentCollege}
                onSave={handleSave}
            />
            <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={closeDeleteModal}
    onConfirm={confirmDelete}
    count={isBulkDelete ? selectedCollegeIds.length : 1}
    entity="college"
    itemName={collegeToDelete?.name}
/>
        </div>
    );
}

export default manageColleges;
