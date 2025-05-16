import React, { useState } from "react";

import { Link } from "react-router-dom";

import { CiUser } from "react-icons/ci";
import { MdGamepad } from "react-icons/md";

import ProfileModal from "./ProfileModal/ProfileModal";

const NavBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="lg:p-12 px-2 py-0 h-[150px] sm:h-[80px] flex-wrap sm:flex-nowrap w-full bg-white flex justify-between items-center lg:justify-between shadow-md shadow-gray-100">
      {/* Logo */}
      <Link to="/" sx={{ textDecoration: "none" }}>
        <MdGamepad className="hidden text-4xl text-pink-500 sm:block" title="Gaming Ecommerce"/>
      </Link>
      
      {/* Features */}
      <div className="flex gap-6 lg:h-[80px]">
        {/* Profile */}
        <div className="relative flex flex-col h-full" onMouseEnter={() => setShowProfileModal(true)} onMouseLeave={() => setShowProfileModal(false)}>
          <div className="flex flex-col items-center justify-center flex-1">
            <CiUser className="text-2xl" />
            <div className="text-xs font-bold">Profile</div>
          </div>
          {showProfileModal && <div className="h-[4px] bg-red-500 w-full">&nbsp;</div>}

          {showProfileModal && <ProfileModal />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
