import React from "react";
import MenuItems from "../MenuItems/MenuItems";
import Topbar from "../Topbar/Topbar";
import RightPanel from "../RightPanel/RightPanel";
import ugiveBlack from "/UGIVEBlack.svg";

const Navbar = () => {
  return (
    <div className="relative ">

      {/* LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 w-60 min-h-screen bg-gradient-to-b from-[#8B78D0] via-[#8B78D09A] to-white border-r border-gray-200 z-50">

        {/* Logo */}
        <div className="flex justify-center pt-6">
          <img src={ugiveBlack} className="w-40 object-contain" />
        </div>

        {/* Menu */}
        <div className="px-4 mt-2 h-screen">
          <MenuItems />
        </div>

      </aside>

      {/* RIGHT SIDEBAR */}
      {/* <aside className="fixed right-0 top-0 w-60 h-screen border-l bg-white border-gray-200 z-50">
        <RightPanel />
      </aside> */}

      {/* TOPBAR */}
      <header className="fixed top-0 left-60 right-60 h-14 z-40">
        <Topbar />
      </header>



    </div>
  );
};

export default Navbar;
