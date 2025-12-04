import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardReadingPage = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen ml-60 mt-14 bg-gray-50 p-8">
            <div className="w-full max-w-4xl">

                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-200 transition transform hover:scale-[1.10] duration-150"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                    </button>
                </div>

                {/* Card Content */}
                <div className="flex flex-col items-center justify-center text-center mt-16">

                    <h1 className="text-xl font-medium mb-6 text-gray-800">
                        Card To Andre - 07/07/2025
                    </h1>

                    {/* Read Card Dropdown Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-between w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"></path>
                                </svg>
                                <span className="text-gray-400">Read Card</span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {/* Dropdown Content */}
                        {isOpen && (
                            <div className="absolute w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                                <div className="p-4">
                                    <p className="text-gray-600 text-sm">Your card message will appear here...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-400 mt-4">
                        Tap on arrow to read your msg!
                    </p>

                </div>
            </div>
        </div>
    );
};

export default CardReadingPage;