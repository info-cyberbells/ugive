import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset } from "../../features/studentSlice";

import {
  LayoutDashboard,
  UserCircle,
  GraduationCap,
  School,
  BookOpen,
  Share2,
  LogOut
} from "lucide-react";

const ROLE_BASED_MENUS = {
  super_admin: [
    { id: "profile", title: "User Profile", icon: UserCircle },
    { id: "manage-universities", title: "Manage Universities", icon: School },
    { id: "manage-colleges", title: "Manage Colleges", icon: GraduationCap },
    { id: "manage-students", title: "Manage Students", icon: BookOpen },
    { id: "social", title: "Social", icon: Share2 },
  ],

  admin: [
    { id: "profile", title: "User Profile", icon: UserCircle },
    { id: "manage-students", title: "Manage Students", icon: BookOpen },
  ],

  student: [
    { id: "profile", title: "User Profile", icon: UserCircle },
    { id: "social", title: "Social", icon: Share2 },
  ],
};

const MenuItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  // Load role-based menu
  const sections = ROLE_BASED_MENUS[role] || [];

  const handleLogout = () => {
    localStorage.clear();
    dispatch(reset());
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <div className="w-full pl-2 font-[Inter] text-black/70 mb-8 h-screen overflow-y-auto">

      {/* DASHBOARD SECTION */}
      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-[#00000066]">Dashboards</h2>

        <NavLink
          to={role === "student" ? "/student-dashboard" : "/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer
     ${isActive ? "bg-[#0000000A] font-semibold text-black" : "hover:bg-[#0000000A]"}`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </NavLink>


      </div>

      {/* PAGES SECTION */}
      <div className="mt-6 flex flex-col gap-3">
        <h2 className="text-[#00000066] text-base">Pages</h2>

        {/* MAIN MENU ITEMS */}
        {sections.map((section) => (
          <NavLink
            key={section.id}
            to={"/" + section.id}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer
     ${isActive ? "bg-[#0000000A] font-semibold text-black" : "hover:bg-[#0000000A]"}`
            }
          >
            <section.icon className="w-5 h-5" />
            <p className="text-sm">{section.title}</p>
          </NavLink>

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