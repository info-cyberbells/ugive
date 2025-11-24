import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import Blog from "/menuIcons/Blog.svg";
import ChatsTeardrop from "/menuIcons/ChatsTeardrop.svg";
import IdentificationCard from "/menuIcons/IdentificationCard.svg";
import UserProfile from "/menuIcons/UserProfile.svg";
import UsersThree from "/menuIcons/UsersThree.svg";
import ecommerce from "/menuIcons/ecommerce.svg";
import overView from "/menuIcons/overView.svg";
import Projects from "/menuIcons/Projects.svg";

const MenuItems = () => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(null);

  const toggleDrawer = (name) => {
    setOpenDrawer(openDrawer === name ? null : name);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
    navigate("/");
  };


  const sections = [
    {
      id: "userProfile",
      title: "User Profile",
      icon: UserProfile,
      items: [
        "User Profile",
        "Overview",
        "Projects",
        "Campaigns",
        "Documents",
        "Followers",
      ],
    },
    {
      id: "account",
      title: "Account",
      icon: IdentificationCard,
      items: ["Settings", "Billing", "Notifications", "Security"],
    },
    {
      id: "corporate",
      title: "Corporate",
      icon: UsersThree,
      items: ["Teams", "Careers", "Partners"],
    },
    {
      id: "blog",
      title: "Blog",
      icon: Blog,
      items: ["Latest Articles", "News", "Stories"],
    },
    {
      id: "social",
      title: "Social",
      icon: ChatsTeardrop,
      items: ["Instagram", "LinkedIn", "Twitter"],
    },
  ];

  return (
    <div className="w-full pl-2 font-[Inter] text-black/70 mb-8 h-screen overflow-y-auto">
      {/* Favorites + Recently */}
      <div className=" flex gap-8 w-full text-[#00000066] text-base">
        <NavLink>Favorites</NavLink>
        <NavLink>Recently</NavLink>
      </div>

      {/* Overview + Projects */}
      <div className="mt-2">
        <nav className="flex flex-col gap-2 text-sm">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-black relative before:content-['•'] before:text-[#00000033] before:text-lg before:mr-2"
          >
            Overview
          </NavLink>

          <NavLink
            to=""
            className="flex items-center gap-2 text-black relative before:content-['•'] before:text-[#00000033] before:text-lg before:mr-2"
          >
            Projects
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-[#00000066]">Dashboards</h2>
        <NavLink
          to="/student-dashboard"
          className={({ isActive }) =>
            `text-black flex items-center gap-2 px-2 py-1 rounded-md 
    ${isActive ? "bg-[#0000000A] text-[#000000]" : ""}`
          }
        >
          <img src={overView} className="w-6 h-6" alt="icon" />
          Overview
        </NavLink>

        <button
          // onClick={() => toggleDrawer()}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">

            <ChevronRight className="w-4 h-4 text-black/50" />

            <img src={ecommerce} className="w-6 h-6" alt="icon" />

            <NavLink className="text-sm font-medium text-black">
              eCommerce
            </NavLink>
          </div>
        </button>
        <button
          // onClick={() => toggleDrawer()}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">

            <ChevronRight className="w-4 h-4 text-black/50" />


            <img src={Projects} className="w-6 h-6" alt="icon" />

            <NavLink className="text-sm font-medium text-black">
              Projects
            </NavLink>
          </div>
        </button>
      </div>

      {/* Drawer Sections */}
      <div className="mt-4 flex flex-col gap-3">
        <h2 className="text-[#00000066] text-base">Pages</h2>
        {sections.map((section) => (
          <div key={section.id}>
            {/* Drawer Header */}
            <button
              onClick={() => toggleDrawer(section.id)}
              className="w-full flex items-center justify-between text-left py-0.5 px-1 rounded-lg hover:bg-[#0000000A]"
            >
              <div className="flex items-center gap-2 ">
                {openDrawer === section.id ? (
                  <ChevronDown className="w-4 h-4 text-black/50" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-black/50" />
                )}

                <img src={section.icon} className="w-6 h-6" alt="icon" />

                <p className=" text-sm text-black cursor-pointer">
                  {section.title}
                </p>
              </div>
            </button>

            {/* Drawer Body */}
            {openDrawer === section.id && (
              <nav className="flex flex-col gap-3 ml-2 mt-2 text-sm animate-fadeIn">
                {section.items.map((item, index) => (
                  <NavLink
                    key={index}
                    className="ml-4 text-black hover:text-gray-700 "
                  >
                    {item}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>
        ))}

        {/* LOGOUT OPTION */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-red-50 text-red-600 mt-4 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>

      </div>
    </div>
  );
};

export default MenuItems;
