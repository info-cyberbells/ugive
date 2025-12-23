import React, { useEffect, useState } from "react";
import {
    Trash2,
    Filter,
    Download,
    Plus,

} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../context/ToastContext";
import { getVendorRewardsBySuperAdmin, auditVendorRewardBySuperAdmin } from "../../../features/superadminVendors";



const VendorRewards = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const {
        rewards,
        isLoading,
        isError,
        totalPages,
        limit,
        page,
    } = useSelector((state) => state.superadminVendors);

    const [selectedVendorIds, setSelectedVendorIds] = useState([]);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);


    useEffect(() => {
        dispatch(getVendorRewardsBySuperAdmin({ page, limit }));
    }, [dispatch, page, limit]);


    const data = rewards || [];

    const isAllSelected =
        data.length > 0 && selectedVendorIds.length === data.length;
    const isAnySelected = selectedVendorIds.length > 0;

    const handleLimitChange = (newLimit) => {
        dispatch(getVendorRewardsBySuperAdmin({ page: 1, limit: Number(newLimit) }));
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        dispatch(getVendorRewardsBySuperAdmin({ page: newPage, limit }));
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


    const handleAudit = async (status) => {
        try {
            await dispatch(
                auditVendorRewardBySuperAdmin({
                    id: selectedReward._id,
                    data: { isActive: status },
                })
            ).unwrap();

            showToast(
                status ? "Reward approved successfully" : "Reward disabled successfully",
                "success"
            );

            dispatch(getVendorRewardsBySuperAdmin({ page, limit }));

            setIsAuditModalOpen(false);
        } catch (error) {
            showToast(error || "Failed to update reward status", "error");
        }
    };


    const handleExportCSV = () => {
        const selected = data.filter((reward) =>
            selectedVendorIds.includes(reward._id)
        );

        if (selected.length === 0) {
            showToast("No rewards selected!", "error");
            return;
        }

        // ✅ Correct headers for rewards
        const headers = [
            "Reward Name",
            "Description",
            "Stock Status",
            "Vendor Name",
            "Vendor Email",
            "University",
            "Created At",
        ];

        // ✅ Correct rows mapped from API response
        const rows = selected.map((reward) => [
            reward.name,
            reward.description || "",
            reward.stockStatus,
            reward.vendor?.name || "",
            reward.vendor?.email || "",
            reward.university?.name || "",
            new Date(reward.createdAt).toLocaleDateString(),
        ]);

        // CSV escape
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return "";
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        };

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((row) => row.map(escapeCSV).join(","))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `vendor_rewards_${new Date().toISOString().split("T")[0]}.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`${selected.length} reward(s) exported successfully!`, "success");
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
                        Vendor's Rewards List
                        <span className="text-sm text-gray-500 font-normal ml-3">
                            {data.length || 0} Rewards
                        </span>
                    </h1>

                    <div className="grid gap-3 sm:flex sm:w-auto w-full">
                        {/* Action Buttons Group */}
                        <div className="grid grid-cols-3 gap-3 sm:flex sm:space-x-3 w-full sm:w-auto">

                            {/* Export Button - Disabled when no colleges are selected */}
                            <button
                                onClick={handleExportCSV}
                                className={`flex cursor-pointer items-center px-10 sm:px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition duration-150 shadow-sm ${isAnySelected
                                    ? "text-gray-700 bg-white hover:bg-gray-50"
                                    : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                                    }`}
                                disabled={!isAnySelected}
                            >
                                Export
                                <Download className="h-4 w-4 ml-2 hidden sm:inline" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table/List Container */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {isLoading ? (
                        <SkeletonTable />
                    ) : data && data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {/* Checkbox */}
                                            <th className="px-4 py-3 w-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                                                />
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Reward Name
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Stock Status
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Vendor Name
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>


                                    {/* Table Body */}
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map((reward) => (
                                            <tr
                                                key={reward._id}
                                                className={`transition ${selectedVendorIds.includes(reward._id)
                                                    ? "bg-indigo-50"
                                                    : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                {/* Checkbox */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedVendorIds.includes(reward._id)}
                                                        onChange={() => handleSelectVendor(reward._id)}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                                                    />
                                                </td>

                                                {/* Reward Name */}
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                    {reward.name}
                                                </td>

                                                {/* Description */}
                                                <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">
                                                    {reward.description || "-"}
                                                </td>

                                                {/* Image */}
                                                <div
                                                    className="relative group cursor-pointer px-6 py-3"
                                                    onClick={() => setPreviewImage(reward.rewardImage)}
                                                >
                                                    <img
                                                        src={reward.rewardImage}
                                                        alt={reward.name}
                                                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl object-cover shadow-md border border-gray-200 group-hover:opacity-90 transition-all"
                                                    />
                                                </div>

                                                {/* Stock Status */}
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${reward.stockStatus === "in_stock"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {reward.stockStatus}
                                                    </span>
                                                </td>

                                                {/* Vendor Name */}
                                                <td className="px-6 py-3 text-sm text-gray-700">
                                                    {reward.vendor?.name || "N/A"}
                                                </td>

                                                {/* Created At */}
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {new Date(reward.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${reward.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {reward.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>


                                                {/* Action */}
                                                <td className="px-6 py-3 text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReward(reward);
                                                            setIsAuditModalOpen(true);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer"
                                                    >
                                                        Audit Reward
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
                ${page === 1
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
                                    No Vendor Reward found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    There are currently no rewards submitted by vendors.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isAuditModalOpen && selectedReward && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsAuditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Audit Reward Details
                        </h2>

                        {/* Reward Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <p className="text-sm text-gray-500">Reward Name</p>
                                <p className="font-medium">{selectedReward.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Stock Status</p>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedReward.stockStatus === "in_stock"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {selectedReward.stockStatus}
                                </span>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-700">{selectedReward.description}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Vendor</p>
                                <p className="font-medium">{selectedReward.vendor?.name}</p>
                                <p className="text-sm text-gray-600">{selectedReward.vendor?.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">University</p>
                                <p className="font-medium">{selectedReward.university?.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="font-medium">
                                    {new Date(selectedReward.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Reward Image</p>
                                <img
                                    src={selectedReward.rewardImage}
                                    alt={selectedReward.name}
                                    className="h-24 w-24 rounded-lg border object-cover"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAuditModalOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>

                            {selectedReward.isActive ? (
                                <button
                                    onClick={() => handleAudit(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                                >
                                    Disable Reward
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAudit(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                                >
                                    Approve Reward
                                </button>
                            )}
                        </div>


                    </div>
                </div>
            )}


        </div>
    );
};

export default VendorRewards;
