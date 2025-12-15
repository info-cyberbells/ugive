import React, { useState } from 'react';
// Import Lucide icons
import { Trash2, Filter, Download, Plus, ArrowUpDown } from 'lucide-react';

// Initial Dummy data for students
const studentData = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@university.edu', streaks: '1', sentCards: "2",status: 'Active', rewardUnlocked: "Coffee" },
    { id: 2, name: 'Bob Williams', email: 'bob.w@university.edu', streaks: '0', sentCards: "1",status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@university.edu', streaks: '', status: 'Active',  rewardUnlocked: "Chocolate" },
    { id: 4, name: 'Diana Prince', email: 'diana.p@university.edu', streaks: '5', sentCards: "1",status: 'Active' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan.h@university.edu', streaks: '1', status: 'Inactive' },
    { id: 6, name: 'Fiona Glenn', email: 'fiona.g@university.edu', streaks: '3', status: 'Active',  rewardUnlocked: "Coffee" },
    { id: 7, name: 'George Harrison', email: 'george.h@university.edu', streaks: '0', sentCards: "2",status: 'Inactive',  rewardUnlocked: "Coffee" },
    { id: 8, name: 'Helen Troy', email: 'helen.t@university.edu', streaks: '8', status: 'Active' },
    { id: 9, name: 'Ivan Koloff', email: 'ivan.k@university.edu', streaks: '1', status: 'Active' },
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

const AdminManageStudents = () => {

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const data = studentData;

    const isAllSelected = selectedStudentIds.length === data.length && data.length > 0;
    const isAnySelected = selectedStudentIds.length > 0;

    // Function to safely display data or 'N/A' if not available
    const displayData = (value) => {
        return (value !== null && value !== undefined && value !== '') ? value : 'N/A';
    };

    // Handler to select/deselect all students
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudentIds(data.map((student) => student.id));
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

    return (
        <div className="min-h-screen lg:ml-60 mt-14 font-[Inter] bg-gray-50 p-4 sm:p-8 ">
            <div className="max-w-7xl mx-auto">

                {/* Header Section (Now responsive to selection state) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Student's List
                        <span className="text-sm text-gray-500 font-normal ml-3">
                            {data.length} Students
                        </span>
                    </h1>

          <div className="grid gap-3 sm:flex sm:w-auto w-full">
                        {/* Action Buttons Group */}
            <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">

                            {/* Delete Button */}
                            <button
                                className={`flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-red-50 hover:text-red-600'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                aria-label="Delete Selected"
                                disabled={!isAnySelected}
                            >
                                Delete ({selectedStudentIds.length})
                                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
                            </button>

                            {/* Export Button */}
                            <button
                                className={`flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                disabled={!isAnySelected}
                            >
                                Export
                                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
                            </button>
                        <button
                            className="flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6955A5] border border-transparent rounded-lg hover:bg-[#533f8e] hover:scale-[1.02] transition duration-150 shadow-md"
                          
                        >
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
                                        <th scope="col" className="px-6 py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Name 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Email 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                College 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Streaks 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Cards Sent 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Status 
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rewards Unlocked
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className={`transition duration-150 ${selectedStudentIds.includes(student.id) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
                                        >
                                            {/* Individual Selection Checkbox */}
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
                                                {displayData(student.name)}
                                            </td>

                                            {/* Email Column */}
                                            <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                                                {displayData(student.email) || "N/A"}
                                            </td>
                                            <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-600">
                                                {displayData(student.college) || "N/A"}
                                            </td>

                                            {/* Phone Column */}
                                            <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                                                {displayData(student.streaks) || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-600">
                                                {displayData(student.sentCards) || "N/A"}
                                            </td>

                                            {/* Status Column (Badge) */}
                                            <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm">
                                                <StatusBadge status={student.status} />
                                            </td>

                                            {/* Action Column (Static buttons for context) */}
                                            <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap text-sm font-medium space-x-3">
                                               {displayData(student.rewardUnlocked) || "N/A"}
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
                                    Displaying student list data only.
                                </p>
                            </div>
                        </div>

                    )}
                </div>

            </div>
        </div>
    );
}

export default AdminManageStudents;