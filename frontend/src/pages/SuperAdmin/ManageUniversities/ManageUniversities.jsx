import React, { useState } from 'react';
import { Trash2, Filter, Download, Plus, ArrowUpDown } from 'lucide-react';
import UniversityModal from '../Modals/UniAddModal';
import ConfirmationModal from '../Modals/deleteModal';

const universityData = [
    // { id: 1, name: 'Harvard University', address_line_1: 'Massachusetts Hall', address_line_2: 'Admissions Office', city: 'Cambridge', state: 'MA', postcode: '02138', status: 'Accredited' },
    // { id: 2, name: 'Stanford University', address_line_1: '450 Serra Mall', address_line_2: null, city: 'Stanford', state: 'CA', postcode: '94305', status: 'Accredited' },
    // { id: 3, name: 'MIT', address_line_1: '77 Massachusetts Ave', address_line_2: '', city: 'Cambridge', state: 'MA', postcode: '02139', status: 'Pending' }, // address_line_2 is empty string
    // { id: 4, name: 'Yale University', address_line_1: '320 Temple St', address_line_2: 'Law School', city: 'New Haven', state: 'CT', postcode: '06511', status: 'Accredited' },
    // { id: 5, name: 'Princeton University', address_line_1: 'Nassau Hall', address_line_2: 'Main Campus', city: 'Princeton', state: 'NJ', postcode: '08544', status: 'Accredited' },
    // { id: 6, name: 'Columbia University', address_line_1: '116th Street', address_line_2: 'Alumni Center', city: 'New York', state: 'NY', postcode: '10027', status: 'Accredited' },
    // { id: 7, name: 'UChicago', address_line_1: '5801 S Ellis Ave', address_line_2: 'Graduate Studies', city: 'Chicago', state: '', postcode: '60637', status: 'Pending' }, // state is empty string
    // { id: 8, name: 'Duke University', address_line_1: '2138 Campus Dr', address_line_2: 'Box 90034', city: 'Durham', state: 'NC', postcode: '27708', status: 'Accredited' },

];

const StatusBadge = ({ status }) => {
    // Mapping status to colors
    const colorMap = {
        'Accredited': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
    };
    const dotColorMap = {
        'Accredited': 'bg-green-500',
        'Pending': 'bg-yellow-500',
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

const ManageUniversities = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUniversity, setCurrentUniversity] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [universityToDelete, setUniversityToDelete] = useState(null); // For single delete
    const [isBulkDelete, setIsBulkDelete] = useState(false); // For bulk delete



    const [selectedUniversityIds, setSelectedUniversityIds] = useState([]);
    const data = universityData;

    const isAllSelected = selectedUniversityIds.length === data.length && data.length > 0;
    const isAnySelected = selectedUniversityIds.length > 0;

    // Handler to select/deselect all universities
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUniversityIds(data.map((uni) => uni.id));
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
        setCurrentUniversity(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (uni) => {
        setCurrentUniversity(uni);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUniversity(null);
    };

    // Logic to save/update data
    const handleSave = (newUniData) => {

    };

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

    const confirmDelete = () => {
        if (isBulkDelete) {

        } else if (universityToDelete) {

        }
        closeDeleteModal();
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
                                    ? 'text-gray-700 bg-white hover:bg-red-50 hover:text-red-600'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                aria-label="Delete Selected"
                                disabled={!isAnySelected}
                            >
                                Delete({selectedUniversityIds.length})
                                <Trash2 className="h-5 w-5 ml-2" />
                            </button>

                            {/* Filters Button (Always active) */}
                            <button
                                className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Filters
                                <Filter className="h-4 w-4 ml-2" />
                            </button>

                            {/* Export Button - Disabled when no universities are selected */}
                            <button
                                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150  ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
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
                                                Name <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Address Line 1 <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Address Line 2 <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                City <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                State <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Postcode <ArrowUpDown size={14} />
                                            </div>
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150">
                                            <div className="flex items-center gap-1">
                                                Status <ArrowUpDown size={14} />
                                            </div>
                                        </th> */}
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((uni) => (
                                        <tr
                                            key={uni.id}
                                            className={`transition duration-150 ${selectedUniversityIds.includes(uni.id) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap w-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUniversityIds.includes(uni.id)}
                                                    onChange={() => handleSelectUniversity(uni.id)}
                                                    className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>

                                            {/* Name Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {uni.name || 'N/A'}
                                            </td>

                                            {/* Address Line 1 Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {uni.address_line_1 || 'N/A'}
                                            </td>

                                            {/* Address Line 2 Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {uni.address_line_2 || 'N/A'}
                                            </td>

                                            {/* City Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {uni.city || 'N/A'}
                                            </td>

                                            {/* State Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {uni.state || 'N/A'}
                                            </td>

                                            {/* Postcode Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {uni.postcode || 'N/A'}
                                            </td>

                                            {/* Status Column (Badge) */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={uni.status} />
                                            </td> */}


                                            {/* Action Column (View, Edit, Delete) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button className="cursor-pointer text-blue-600 hover:text-blue-900">
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => openModalForEdit(uni)}
                                                    className="cursor-pointer text-yellow-600 hover:text-yellow-900">
                                                    Edit
                                                </button>
                                                <button onClick={() => openDeleteModalForSingle(uni)}

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

                                <h3 className="mt-2 text-lg font-medium text-gray-900">No universities found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding a new university using the "Add New University" button.
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
}

export default ManageUniversities;
