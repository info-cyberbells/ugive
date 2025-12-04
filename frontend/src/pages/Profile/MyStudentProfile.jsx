import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const MyStudentProfile = () => {
    const navigate = useNavigate();
    const [showProfileInfo, setShowProfileInfo] = useState(false);

    const handleBack = () => {
        if (showProfileInfo) {
            setShowProfileInfo(false);
        } else {
            navigate(-1);
        }
    };

    const handleYourPoints = () => {
        console.log('Navigate to Your Points');
    };

    const handleCardsSent = () => {
        console.log('Navigate to Cards Sent');
    };

    const handleProfileInfo = () => {
        setShowProfileInfo(true);
    };

    if (showProfileInfo) {
        return (
            <div className="min-h-screen mt-14 bg-gray-50 p-8">
                <div className="w-full max-w-4xl mx-auto">

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


                    {/* Profile Avatar */}
                    <div className="flex justify-center mb-8">
                        <div className="w-32 h-32 bg-[#6558A1] rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="max-w-md mx-auto">
                        <div className="space-y-6 text-center">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Name: <span className="text-gray-700 font-medium">Annie Phillips</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Mobile: <span className="text-gray-700 font-medium">0478040086</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Email: <span className="text-gray-700 font-medium">annie.phillips93@gmail.com</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">University: <span className="text-gray-700 font-medium">University of Queensland</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">College: <span className="text-gray-700 font-medium">Pitt Hall</span></p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">USI: <span className="text-gray-700 font-medium">321</span></p>
                            </div>

                            <div className="flex flex-col gap-4 pt-5">
                                <button className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#6558A1] hover:bg-[#7A6CCF] text-white font-medium transition transform hover:scale-[1.02]">
                                    Edit Account
                                </button>
                                <button className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#8B79C4] hover:bg-[#6F5FA3] text-white font-medium transition transform hover:scale-[1.02]">
                                    Sign Out
                                </button>
                                <button className="w-[250px] mx-auto py-3 cursor-pointer rounded-full bg-[#8B79C4] hover:bg-[#6F5FA3] text-white font-medium transition transform hover:scale-[1.02]">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-14 bg-gray-50 p-8">
            <div className="w-full max-w-4xl mx-auto">

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

                    {/* Profile Avatar */}
                    <div className="w-32 h-32 bg-[#E9B243] rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>

                    {/* Greeting */}
                    <h1 className="text-3xl font-semibold mb-8">
                        Hey, <span className="text-[#E9B243]">Annie</span>!
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