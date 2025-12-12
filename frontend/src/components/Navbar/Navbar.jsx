import React from "react";
import MenuItems from "../MenuItems/MenuItems";
import Topbar from "../Topbar/Topbar";
import RightPanel from "../RightPanel/RightPanel";
import ugiveBlack from "/UGIVEBlack.svg";

const ROLE_BASED_BG_COLOR = {
  super_admin: ["bg-gradient-to-b from-[#8B78D0] via-[#9D88DD] to-white"],
  admin: ["bg-gradient-to-b from-[#8B78D0] via-[#9D88DD] to-white"],
  student: ["bg-white"],
};

const Navbar = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

    const roleBg = ROLE_BASED_BG_COLOR[role] || ["bg-white"];

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  return (
    <div className="relative ">

      {/* LEFT SIDEBAR */}
      <aside 
       className={`
    fixed top-0 left-0 w-60 min-h-screen ${roleBg.join(" ")}
    border-r border-gray-200 z-50
    transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}   
    lg:translate-x-0                                         
  `}
      >

        {/* Logo */}
        <div className="flex justify-center pt-6">
          <img src={ugiveBlack} className="w-40 object-contain" />
        </div>

        {/* Menu */}
        <div className="px-4 mt-2 h-screen bg-opacity-100">
          <MenuItems setIsSidebarOpen={setIsSidebarOpen} />
        </div>

      </aside>

      {/* RIGHT SIDEBAR */}
      {/* <aside className="fixed right-0 top-0 w-60 h-screen border-l bg-white border-gray-200 z-50">
        <RightPanel />
      </aside> */}

      {/* TOPBAR */}
      <header className="fixed top-0 left-60 right-60 h-14 z-40">
        {/* <Topbar /> */}
        <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      </header>



    </div>
  );
};

export default Navbar;
