import React from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe } from "lucide-react";

const socialLinks = [
    {
        name: "Facebook",
        icon: <Facebook className="w-5 h-5 text-blue-600" />,
        url: "https://facebook.com/yourpage",
    },
    {
        name: "Instagram",
        icon: <Instagram className="w-5 h-5 text-pink-500" />,
        url: "https://instagram.com/yourprofile",
    },
    {
        name: "LinkedIn",
        icon: <Linkedin className="w-5 h-5 text-blue-700" />,
        url: "https://linkedin.com/in/yourprofile",
    },
    {
        name: "Twitter",
        icon: <Twitter className="w-5 h-5 text-blue-400" />,
        url: "https://twitter.com/yourprofile",
    },
    {
        name: "YouTube",
        icon: <Youtube className="w-5 h-5 text-red-600" />,
        url: "https://youtube.com/yourchannel",
    },
    {
        name: "Website",
        icon: <Globe className="w-5 h-5 text-indigo-600" />,
        url: "https://yourwebsite.com",
    },
];

const SuperAdminSocialLinks = () => {
    return (
        <div className="min-h-screen lg:mt-14 lg:ml-56 p-6 bg-gray-50 font-[Inter]">
            <div className="max-w-3xl mx-auto">

                {/* Page Title */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Social Media
                </h1>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-gray-600 text-sm mb-6">
                        Follow us or view our official social platforms.
                    </p>

                    {/* Social Links List */}
                    <div className="space-y-4">
                        {socialLinks.map((item, index) => (
                            <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="text-gray-800 font-medium">{item.name}</span>
                                </div>

                                <span className="text-indigo-600 text-sm">{item.url}</span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuperAdminSocialLinks;
