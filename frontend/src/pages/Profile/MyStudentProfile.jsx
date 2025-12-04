import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../features/studentSlice";
import { resetStudentState } from "../../features/studentDataSlice";
import { clearProfile } from "../../features/superadminProfileSlice";
import { fetchProfile } from '../../features/studentDataSlice';




const MyStudentProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const { studentProfile } = useSelector((state) => state.studentData);

    useEffect(()=>{
        if(!showDeleteAccount){
            dispatch(fetchProfile());
        }
    },[])


    const deleteReasons = [
        "I'm not using the app anymore",
        "I have privacy concerns",
        "I found a better alternative",
        "Too many notifications",
        "Technical issues",
        "Other"
    ];

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

    const handleConfirmDelete = () => {
        if (selectedReason) {
            // Call logout function
            handleLogout();
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
            <div className="min-h-screen ml-60 mt-14 bg-gray-50 p-8">
                <div className="w-full max-w-4xl">

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
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Account</h2>
                            <p className="text-gray-600 text-sm">We're sorry to see you go. Please tell us why you want to delete your account.</p>
                        </div>

                        {/* Reasons Selection */}
                        <div className="space-y-3 mb-8">
                            {deleteReasons.map((reason, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedReason(reason)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition transform hover:scale-[1.02] ${selectedReason === reason
                                            ? 'border-[#E9B243] bg-amber-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedReason === reason
                                                ? 'border-[#E9B243] bg-[#E9B243]'
                                                : 'border-gray-300'
                                            }`}>
                                            {selectedReason === reason && (
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-gray-700 font-medium">{reason}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmDelete}
                            disabled={!selectedReason}
                            className={`w-full py-3 rounded-full font-medium transition transform hover:scale-[1.02] ${selectedReason
                                    ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Confirm Delete Account
                        </button>

                        <p className="text-center text-gray-500 text-xs mt-4">
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    // Profile Info Screen
    if (showProfileInfo) {
        return (
            <div className="min-h-screen ml-60 mt-14 bg-gray-50 p-8">
                <div className="w-full max-w-4xl">

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
                                <p className="text-gray-500 text-sm mb-1">Name: <span className="text-gray-700 font-medium">{studentProfile?.name || "Annie Phillips"}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Mobile: <span className="text-gray-700 font-medium">{studentProfile?.phoneNumber || "1234 567 890"}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Email: <span className="text-gray-700 font-medium">{studentProfile?.email || "annie.phillips93@gmail.com"}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">University: <span className="text-gray-700 font-medium">{studentProfile?.university?.name || "University of Queensland"}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">College: <span className="text-gray-700 font-medium">{studentProfile?.college?.name || "Pitt Hall"}</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">USI: <span className="text-gray-700 font-medium">{studentProfile?.studentUniId || "USI-123ABC"}</span></p>
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
        <div className="min-h-screen ml-60 mt-14 bg-gray-50 p-8">
            <div className="w-full max-w-4xl">

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