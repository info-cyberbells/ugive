import React from "react";
import { Share2, Copy, ExternalLink, Gift } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ReferShare = () => {
    const { showToast } = useToast();

    const referralLink =
        "https://play.google.com/store/apps/details?id=com.ugive.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        showToast("Referral link copied!", "success");
    };

    const openPlayStore = () => {
        window.open(referralLink, "_blank");
    };

    return (
        <div className="lg:ml-60 mt-14 p-6 bg-gray-50 min-h-screen font-[Inter]">

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#5D3F87]">
                    Refer & Share
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Invite your friends to join and stay connected.
                </p>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-3xl">

                    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 lg:mt-15">

                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Invite Friends
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Share the app link with your friends so they can join,
                                    send cards, and connect with you.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                App Invitation Link
                            </label>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    onClick={(e) => e.target.select()}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm 
text-gray-900 bg-white font-medium select-all cursor-text"
                                />

                                <button
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                                    title="Copy link"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={openPlayStore}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open on Play Store
                            </button>

                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                Copy & Share Link
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferShare;
