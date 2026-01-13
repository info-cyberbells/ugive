import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../features/studentSlice";
import { deleteStudentAccount, resetStudentState } from "../../features/studentDataSlice";
import { clearProfile } from "../../features/superadminProfileSlice";
import { fetchProfile } from '../../features/studentDataSlice';
import { useToast } from '../../context/ToastContext';




const MyStudentProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const { studentProfile } = useSelector((state) => state.studentData);

    useEffect(() => {
        if (!showDeleteAccount) {
            dispatch(fetchProfile());
        }
    }, [])


    const handleBack = () => {
        if (showDeleteAccount) {
            setShowDeleteAccount(false);
            setShowProfileInfo(true);
        } else if (showProfileInfo) {
            setShowProfileInfo(false);
        } else {
            navigate(-1);
        }
    };

    const handleYourPoints = () => {
        console.log('Navigate to Your Points');
        navigate('/lets-go')
    };

    const handleCardsSent = () => {
        console.log('Navigate to Cards Sent');
        navigate("/my-cards")
    };

    const handleProfileInfo = () => {
        setShowProfileInfo(true);
    };

    const handleDeleteAccount = () => {
        setShowDeleteAccount(true);
        setShowProfileInfo(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedReason) return;
        try {
            await dispatch(deleteStudentAccount()).unwrap();
            showToast("Account deleted successfully", "success");

            handleLogout();

        } catch (error) {
            showToast(error || "Failed to delete account", "error");
        }
    };


    const handleLogout = () => {
        localStorage.clear();
        dispatch(reset());
        dispatch(logout());
        dispatch((resetStudentState()));
        dispatch(clearProfile());
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
    };

    // Delete Account Screen
    if (showDeleteAccount) {
        return (
            <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 p-8">
                <div className="w-full">

                    {/* Back Button */}
                    <div className="mb-5 text-indigo-800">
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Delete Account Content */}
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-4">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Account</h2>
                            <h3 className='text-center text-gray-500 text-base mt-2'>Are you sure you want to remove your account.</h3>
                            <p className="text-center text-gray-500 text-sm mt-1">
                                This action cannot be undone.
                            </p>
                        </div>


                        <div className='flex gap-4 justify-center'>
                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmDelete}

                                className={`px-8 py-3 rounded-full font-medium transition transform hover:scale-[1.02] bg-green-500 hover:bg-green-600 text-white cursor-pointer`}
                            >
                                Yes
                            </button>

                            <button
                                onClick={handleBack}
                                className={`px-8 py-3 rounded-full font-medium transition transform hover:scale-[1.02] bg-red-500 hover:bg-red-600 text-white cursor-pointer`}

                            >
                                No
                            </button>

                        </div>
                        {/* <p className="text-gray-600 text-sm">We're sorry to see you go.  All your data will be permanently deleted.</p> */}


                    </div>

                </div>
            </div>
        );
    }

    // Profile Info Screen
    if (showProfileInfo) {
        return (
            <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 p-8">
                <div className="w-full">

                    {/* Back Button */}
                    <div className="mb-5 text-indigo-800">
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </button>
                    </div>


                    <div className='flex justify-center mb-8'>
                        {studentProfile?.profileImage ? (
                            <img
                                src={studentProfile.profileImage}
                                alt="User"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-[#6558A1] rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Profile Information */}
                    <div className="max-w-md mx-auto">
                        <div className="space-y-6 text-center">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Name: <span className="text-gray-700 font-medium">{studentProfile?.name}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Mobile: <span className="text-gray-700 font-medium">{studentProfile?.phoneNumber}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Email: <span className="text-gray-700 font-medium">{studentProfile?.email}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">University: <span className="text-gray-700 font-medium">{studentProfile?.university?.name}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">College: <span className="text-gray-700 font-medium">{studentProfile?.college?.name || null}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">USI: <span className="text-gray-700 font-medium">{studentProfile?.studentUniId}</span></p>
                            </div>

                            <div className="flex flex-col gap-4 pt-5">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#6558A1] hover:bg-[#7A6CCF] text-white font-medium transition transform hover:scale-[1.02]">
                                    Edit Account
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#8B79C4] hover:bg-[#6F5FA3] text-white font-medium transition transform hover:scale-[1.02]">
                                    Sign Out
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#8B79C4] hover:bg-[#6F5FA3] text-white font-medium transition transform hover:scale-[1.02]">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // Main Profile Screen
    return (
        <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 p-8">
            <div className="w-full ">

                {/* Back Button */}
                <div className="mb-8 text-indigo-800">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                    </button>
                </div>

                {/* Profile Content */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div>
                        {studentProfile?.profileImage ? (
                            <img
                                src={studentProfile.profileImage}
                                alt="User"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-[#E9B243] rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Profile Avatar */}


                    {/* Greeting */}
                    <h1 className="text-3xl font-semibold mb-8">
                        Hey, <span className="text-[#E9B243]">{studentProfile?.name}</span>!
                    </h1>

                    {/* Menu Buttons */}
                    <div className="flex flex-col gap-4 w-full max-w-xs pt-5">
                        <button
                            onClick={handleProfileInfo}
                            className="w-[250px] mx-auto py-3 rounded-full cursor-pointer text-white font-medium shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]
                         bg-[#E9B243]
                         hover:bg-[#daa232]
                         focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50"
                        >
                            Profile Info
                        </button>

                        <button
                            onClick={handleYourPoints}
                            className="w-[250px] mx-auto py-3 rounded-full cursor-pointer text-white font-medium shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]
                         bg-[#E9B243]
                         hover:bg-[#daa232]
                         focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50"
                        >
                            Your Points
                        </button>

                        <button
                            onClick={handleCardsSent}
                            className="w-[250px] mx-auto py-3 rounded-full cursor-pointer text-white font-medium shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]
                         bg-[#E9B243]
                         hover:bg-[#daa232]
                         focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50"
                        >
                            Cards Sent
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MyStudentProfile;