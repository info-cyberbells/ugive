import React, { useState, useEffect } from 'react';
import { Trash2, Filter, Download, Plus, ChevronDown, ArrowUpDown } from 'lucide-react';
import StudentModal from '../Modals/StudentAddModal';
import ConfirmationModal from '../Modals/deleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "../../../context/ToastContext";
import RewardModal from '../Modals/RewardModel';
import { getAllRewards, createReward, deleteReward, updateReward, getSingleReward } from '../../../features/rewardSlice';



const ManageRewards = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { rewards = [], tableLoading, isLoading, isError, page, limit, totalPages, totalRewards } = useSelector((state) => state.reward);

    const rewardsList = rewards || [];

    const [selectedRewardIds, setSelectedRewardIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReward, setCurrentReward] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rewardToDelete, setRewardToDelete] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const isAllSelected = rewards.length > 0 && selectedRewardIds.length === rewards.length ;
    const isAnySelected = selectedRewardIds.length > 0;
    const [previewImage, setPreviewImage] = useState(null);

    const [currentPage, setCurrentPage] = useState(page);
    const [currentLimit, setCurrentLimit] = useState(limit);



    useEffect(() => {
        dispatch(getAllRewards({ page: currentPage, limit: currentLimit }));
    }, [dispatch, currentPage, currentLimit]);



    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleLimitChange = (value) => {
        setCurrentLimit(Number(value));
        setCurrentPage(1); // reset to page 1
    };



    // Handler to select/deselect all students
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRewardIds(rewards.map((r) => r._id));
        } else {
            setSelectedRewardIds([]);
        }
    };


    const handleSelectReward = (id) => {
        setSelectedRewardIds((prev) =>
            prev.includes(id)
                ? prev.filter((rid) => rid !== id)
                : [...prev, id]
        );
    };


    // useEffect(() => {
    //     if (isSuccess && message) {
    //         showToast(message, 'success');
    //         dispatch(reset());
    //     }
    //     if (isError && message) {
    //         showToast(message, 'error');
    //         dispatch(reset());
    //     }
    // }, [
    //     // isSuccess, isError, message,

    //     dispatch, showToast]);

    const openModalForAdd = () => {
        setCurrentReward(null);
        setIsModalOpen(true);
    };

    // const openModalForEdit = (reward) => {
    //     setCurrentReward(reward);
    //     setIsModalOpen(true);
    // };

    const openModalForEdit = (reward) => {
        dispatch(getSingleReward(reward._id)).then(() => {
            setCurrentReward({ ...reward, mode: "edit" });
            setIsModalOpen(true);
        });
    };

    const openModalForView = (reward) => {
        dispatch(getSingleReward(reward._id)).then(() => {
            setCurrentReward({ ...reward, mode: "view" });
            setIsModalOpen(true);
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentReward(null);
    };



    const handleSave = (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("university", data.university);
        if (data.college && data.college.trim() !== "") {
            formData.append("college", data.college);
        }
        formData.append("rewardDescription", data.rewardDescription);

        formData.append("totalPoints", data.totalPoints);

        if (data.rewardImage) {
            formData.append("rewardImage", data.rewardImage);
        } else if (data.rewardImagePath) {
            formData.append("rewardImagePath", data.rewardImagePath);
        }
        dispatch(createReward(formData))
            .unwrap()
            .then(() => {
                showToast("Reward created successfully!", "success");
                dispatch(getAllRewards({ page: currentPage, limit: currentLimit }));
                setIsModalOpen(false);
            })
            .catch((err) => {
                showToast(err || "Failed to create reward", "error");
            });
    };



    // --- Delete Modal Handlers ---
    const openDeleteModalForSingle = (reward) => {
        setIsBulkDelete(false);
        setRewardToDelete(reward);
        setIsDeleteModalOpen(true);
    };

    const openDeleteModalForBulk = () => {
        if (!isAnySelected) return;
        setRewardToDelete(null);
        setIsBulkDelete(true);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setRewardToDelete(null);
        setIsBulkDelete(false);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
            Promise.all(selectedRewardIds.map(id => dispatch(deleteReward(id)).unwrap()))
                .then(() => {
                    showToast(`Deleted ${selectedRewardIds.length} rewards successfully!`, "success");
                    setSelectedRewardIds([]);
                    dispatch(getAllRewards({ page: currentPage, limit: currentLimit }));
                    closeDeleteModal();
                })
                .catch((err) => {
                    showToast(err || "Failed to delete students!", "error");
                    closeDeleteModal();
                });
        } else if (rewardToDelete) {
            dispatch(deleteReward(rewardToDelete._id))
                .unwrap()
                .then(() => {
                    showToast("Reward deleted successfully!", "success");
                    dispatch(getAllRewards({ page: currentPage, limit: currentLimit }));
                    closeDeleteModal();
                })
                .catch((err) => {
                    showToast(err || "Failed to delete Reward!", "error");
                    closeDeleteModal();
                });
        }
    };


    const handleExportCSV = () => {
        const selected = rewards.filter(reward =>
            selectedRewardIds.includes(reward._id)
        );

        if (selected.length === 0) {
            showToast("No Reward selected!", "error");
            return;
        }

        const headers = [
            "Name",
            "Points",
            "Reward Desc.",
            "Uni Name",
            "College"
        ];

        const rows = selected.map(reward => [
            reward.name,
            reward.totalPoints,
            reward.rewardDescription,
            reward.university?.name,
            reward.college?.name
        ]);

        // Fix CSV — wrap values in quotes to prevent merging
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return "";
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        };

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map(row => row.map(escapeCSV).join(","))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = "rewards_export.csv";
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
        <div className="min-h-screen mt-14 lg:mt-14 lg:ml-56 font-[Inter] bg-gray-50 px-3 py-4 md:p-4 lg:p-8 ">
            <div className="max-w-8xl">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                        Reward's List
                        <span className="text-sm text-gray-500 font-normal ml-3">
                            {totalRewards || 0} Reward's
                        </span>
                    </h1>

                    <div className="grid gap-3 sm:flex sm:w-auto w-full">
                        {/* Action Buttons Group */}
                        <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">

                            <button
                                onClick={openDeleteModalForBulk}
                                className={`flex items-center px-6 sm:px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? 'text-gray-700 cursor-pointer  bg-white hover:bg-red-50 hover:text-red-600'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                aria-label="Delete Selected"
                                disabled={!isAnySelected}
                            >
                                Delete({selectedRewardIds.length})
                                <Trash2 className="h-5 w-5 ml-2 hidden sm:inline" />
                            </button>

                            {/* Filters Button (Always active) */}
                            {/* <button
                                className="flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Filters
                                <Filter className="h-4 w-4 ml-2" />
                            </button> */}

                            {/* Export Button - Disabled when no students are selected */}
                            <button
                                onClick={handleExportCSV}
                                className={`flex items-center justify-center px-10 sm:px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? 'text-gray-700 cursor-pointer  bg-white hover:bg-gray-50'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-70'
                                    }`}
                                disabled={!isAnySelected}
                            >
                                Export
                                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
                            </button>

                            {/* Add New Student Button (Always active) */}
                            <button
                                onClick={openModalForAdd}
                                className="flex cursor-pointer items-center justify-center sm:px-4 py-2 text-[10px] sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                            >
                                <Plus className="h-5 w-5 mr-2 -ml-1 hidden sm:inline" />
                                Add New Reward
                            </button>
                        </div>

                    </div>
                </div>

                {/* Table/List Container */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {tableLoading ? (
                        <SkeletonTable />
                    ) : rewards.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th scope="col"
                                                className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                    className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </th>

                                            <th scope="col"
                                                className="sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Reward Name
                                                </div>
                                            </th>

                                            <th scope="col"
                                                className="hidden md:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                            >
                                                <div className="flex items-center gap-1">
                                                    University
                                                </div>
                                            </th>

                                            <th scope="col"
                                                className="hidden lg:table-cell sm:px-6 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                            >
                                                <div className="flex items-center gap-1">
                                                    College
                                                </div>
                                            </th>
                           
                                            <th scope="col"
                                                className="sm:px-6 py-1 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Action
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rewards.map((reward) => (
                                            <tr
                                                key={reward._id}
                                                className={`transition duration-150 ${selectedRewardIds.includes(reward._id) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}
                                            >
                                                <td
                                                    className="px-2 sm:px-6 sm:py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRewardIds.includes(reward._id)}
                                                        onChange={() => handleSelectReward(reward._id)}
                                                        className="form-checkbox cursor-pointer h-2 w-2 sm:h-4 sm:w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                </td>

                                                {/* Name Column (Bold Text) */}
                                                <td className="sm:px-6 py-1 sm:py-4 whitespace-nowrap text-xs sm:text-sm sm:font-medium text-gray-900">
                                                    <div className="flex items-center gap-4">

                                                        {/* Image Box */}
                                                        <div
                                                            className="relative group cursor-pointer"
                                                            onClick={() => setPreviewImage(reward.rewardImage)}
                                                        >
                                                            <img
                                                                src={reward.rewardImage}
                                                                alt={reward.name}
                                                                className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl object-cover shadow-md border border-gray-200 group-hover:opacity-90 transition-all"
                                                            />

                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                                <span className="text-white text-xs bg-black/40 px-2 py-1 rounded-md">
                                                                    View
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Reward Details */}
                                                        <div>
                                                            <p className="text-gray-900 font-semibold text-sm">
                                                                {reward.name}
                                                            </p>

                                                            <p className="text-gray-500 text-xs mt-1">
                                                                {reward.totalPoints} Points
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>



                                                <td className="hidden md:table-cell sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {reward.university?.name || 'N/A'}
                                                </td>

                                                {/* Email Column */}
                                                <td className="hidden lg:table-cell sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {reward.college?.name || 'N/A'}
                                                </td>

                                              

                                                {/* Action Column (View, Edit, Delete) */}
                                                <td className="sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-3">
                                                    <button
                                                       

                                                        onClick={() => openModalForView(reward)}

                                                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                       

                                                        onClick={() => openModalForEdit(reward)}


                                                        className="cursor-pointer text-yellow-600 hover:text-yellow-900">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModalForSingle(reward)}
                                                        className="cursor-pointer text-red-600 hover:text-red-900">
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
                                    <span className="text-xs sm:text-sm text-gray-600">Rows per page:</span>
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


                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className={`px-3 py-1 text-xs sm:text-sm border rounded 
                ${page === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white cursor-pointer hover:bg-gray-50"
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
                ${page === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white cursor-pointer hover:bg-gray-50"
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

                                <h3 className="mt-2 text-lg font-medium text-gray-900">No reward found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by adding a new reward using the "Add New Reward" button.
                                </p>
                            </div>
                        </div>

                    )}
                </div>

            </div>
            <RewardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                rewardId={currentReward?._id}
                mode={currentReward?.mode}
                onSave={handleSave}
                page={currentPage}
                limit={currentLimit}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                count={isBulkDelete ? selectedRewardIds.length : 1}
                entity="reward"
                itemName={rewardToDelete?.name}
            />

            {previewImage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-xl shadow-xl p-4 max-w-lg w-full">

                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
                        >
                            ✕
                        </button>

                        {/* Big Image */}
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto rounded-xl object-cover shadow-md"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageRewards;