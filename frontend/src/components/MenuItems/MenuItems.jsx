import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, reset } from "../../features/studentSlice";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  LayoutDashboard,
  UserCircle,
  GraduationCap,
  School,
  BookOpen,
  Share2,
  LogOut,
  Gift,
  Flame,
  Store,
  Users,
  BellRing,
  Settings,
  HelpCircle,
  MessageSquare,
  Ticket,
  UserCog,
  Trophy,
  BadgePercent
} from "lucide-react";
import { resetStudentState } from "../../features/studentDataSlice";
import { clearProfile } from "../../features/superadminProfileSlice";
import { adminreset } from "../../features/adminSlice";

const ROLE_BASED_MENUS = {
  super_admin: [
    // { id: "profile", title: "Manage Profile", icon: UserCircle },
    { id: "manage-universities", title: "Manage Universities", icon: School },
    { id: "manage-colleges", title: "Manage Colleges", icon: GraduationCap },
    { id: "manage-admins", title: "Manage Admins", icon: UserCog },
    { id: "manage-students", title: "Manage Students", icon: BookOpen },
    { id: "manage-vendors", title: "Manage Vendors", icon: Store },
    { id: "vendor-rewards", title: "Create Rewards", icon: Trophy },
    { id: "manage-rewards", title: "Manage Rewards", icon: Gift },
    { id: "feedbacks", title: "Manage Feedback", icon: MessageSquare },
    { id: "social", title: "Social", icon: Share2 },
  ],

  admin: [
    // { id: "profile", title: "User Profile", icon: UserCircle },
    { id: "admin-students", title: "Students", icon: BookOpen },
    { id: "admin-colleges", title: "Colleges", icon: GraduationCap },
    { id: "admin-vendors", title: "Vendors", icon: Store },
    { id: "admin-manage-rewards", title: "Manage Rewards", icon: Store },
    { id: "admin-rewards", title: "Student Rewards", icon: Gift },
    { id: "admin-cards", title: "Cards", icon: Ticket },
    { id: "push-notifications", title: "Push Notifications", icon: BellRing },
    {
      id: "support",
      title: "Support",
      icon: HelpCircle,
      children: [
        { id: "privacy-policy", title: "Privacy Policy" },
        { id: "terms-and-conditions", title: "Terms & Conditions" },
        { id: "contactus", title: "Contact Us" },
      ],
    },
  ],
  vendor: [
    { id: "profile", title: "Manage Profile", icon: UserCircle },
    { id: "vendor-reward", title: "Manage Rewards", icon: Gift },
    { id: "vendor-card", title: "Cards", icon: Ticket },
  ],
  student: [
    // { id: "profile", title: "User Profile", icon: UserCircle },
    { id: "rewards-catalog", title: "Rewards", icon: Gift },
    { id: "streaks", title: "Streaks", icon: Flame },
    { id: "my-cards", title: "Sent Cards", icon: Ticket },
    { id: "friends", title: "Friends", icon: Users },
    // { id: "settings", title: "Settings", icon: Settings },
    {
      id: "support",
      title: "Support",
      icon: HelpCircle,
      children: [
        { id: "privacy-policy", title: "Privacy Policy" },
        { id: "terms-and-conditions", title: "Terms & Conditions" },
        { id: "contactus", title: "Contact Us" },
      ],
    },
    { id: "refer-share", title: "Refer & Share", icon: Share2 },
  ],
};

const ROLE_BASED_BG_COLOR = {
  super_admin: ["bg-purple-600"],
  admin: ["bg-purple-600"],
  student: ["bg-white"],
};

const MenuItems = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  // Load role-based menu
  const sections = ROLE_BASED_MENUS[role] || [];

  const handleLogout = () => {
    localStorage.clear();
    dispatch(reset());
    dispatch(logout());
    dispatch(resetStudentState());
    dispatch(clearProfile());
    dispatch(adminreset());
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <div className="w-full pl-2 font-[Inter] text-black/70 mb-8 h-screen overflow-y-auto">
      {/* DASHBOARD SECTION */}
      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-[#00000066]">Dashboards</h2>

        <NavLink
          to={role === "student" ? "/student-dashboard" : role === "super_admin" ? "/dashboard" : role === "admin" ? "/admin-dashboard" : role === "vendor" ? "/vendor-dashboard" : "/"}
          onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer
     ${isActive
              ? "bg-[#0000000A] font-semibold text-black"
              : "hover:bg-[#0000000A]"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </NavLink>
      </div>

      {/* PAGES SECTION */}
      <div className="mt-6 flex flex-col gap-1">
        <h2 className="text-[#00000066] text-base">Pages</h2>

        {sections.map((section) => (
          <div key={section.id}>
            {section.children ? (
              // KEEP DIV IF CHILDREN EXIST
              <div
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === section.id ? null : section.id
                  )
                }
                className={`w-full flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer
      ${openDropdown === section.id
                    ? "bg-[#0000000A] font-semibold text-black"
                    : "hover:bg-[#0000000A]"
                  }`}
              >
                <section.icon className="w-5 h-5" />
                <p className="text-sm flex-1">{section.title}</p>

                {openDropdown === section.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            ) : (
              // USE NAVLINK IF NO CHILDREN → FIXES HIGHLIGHT
              <NavLink
                to={"/" + section.id}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 py-2 lg:py-1.5 2xl:py-2 px-2 rounded-lg cursor-pointer
        ${isActive
                    ? "bg-[#0000000A] font-semibold text-black"
                    : "hover:bg-[#0000000A]"
                  }`
                }
              >
                <section.icon className="w-5 h-5" />
                <p className="text-sm flex-1">{section.title}</p>
              </NavLink>
            )}

            {section.children && openDropdown === section.id && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                {section.children.map((child) => (
                  <NavLink
                    key={child.id}
                    onClick={() => setIsSidebarOpen(false)}
                    to={"/" + child.id}
                    className={({ isActive }) =>
                      `w-full text-sm py-1 px-2 rounded-md 
              ${isActive ? "font-semibold text-black" : "hover:bg-[#0000000A]"}`
                    }
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            )}
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