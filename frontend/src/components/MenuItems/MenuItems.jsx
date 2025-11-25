import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset } from "../../features/studentSlice";

// import UserProfile from "/menuIcons/UserProfile.svg";
// import IdentificationCard from "/menuIcons/IdentificationCard.svg";
// import UsersThree from "/menuIcons/UsersThree.svg";
// import Blog from "/menuIcons/Blog.svg";
// import ChatsTeardrop from "/menuIcons/ChatsTeardrop.svg";
// import overView from "/menuIcons/overView.svg";

import {
  LayoutDashboard,
  UserCircle,
  GraduationCap,
  School,
  BookOpen,
  Share2,
  LogOut
} from "lucide-react";



const MenuItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(reset());
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const sections = [
    {
      id: "profile",
      title: "User Profile",
      icon: UserCircle,
    },
    {
      id: "manage-universities",
      title: "Manage Universities",
      icon: School,
    },
    {
      id: "manage-colleges",
      title: "Manage Colleges",
      icon: GraduationCap,
    },
    {
      id: "manage-students",
      title: "Manage Students",
      icon: BookOpen,
    },
    {
      id: "social",
      title: "Social",
      icon: Share2,
    },
  ];

  return (
    <div className="w-full pl-2 font-[Inter] text-black/70 mb-8 h-screen overflow-y-auto">

      {/* DASHBOARD SECTION */}
      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-[#00000066]">Dashboards</h2>

        <div
          onClick={() => navigate("/dashboard")}
          className="text-black flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#0000000A] cursor-pointer"
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </div>
      </div>

      {/* PAGES SECTION */}
      <div className="mt-6 flex flex-col gap-3">
        <h2 className="text-[#00000066] text-base">Pages</h2>

        {/* MAIN MENU ITEMS */}
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => navigate("/" + section.id)}
            className="w-full flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#0000000A] cursor-pointer"
          >
            <section.icon className="w-5 h-5" />
            <p className="text-sm text-black">{section.title}</p>
          </div>
        ))}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>

      </div>
    </div>
  );

};

export default MenuItems;
