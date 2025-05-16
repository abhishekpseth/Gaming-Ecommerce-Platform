import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { MdGamepad } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";

import { setSearchInput, setSearchToggle } from "../../../slices/searchSlice";

import userUtils from "../../Utils/User/User.util";
import ProfileModal from "./ProfileModal/ProfileModal";

const NavBar = () => {
  const navigate = useNavigate();

  const { searchInput } = useSelector((state) => state.searchSlice);
  const { cartSize } = useSelector((state) => state.cartSlice);

  const dispatch = useDispatch();

  const [showProfileModal, setShowProfileModal] = useState(false);

  const searchForProducts = () => {
    navigate("/");
    dispatch(setSearchToggle(true));
  };

  return (
    <div className="lg:p-12 px-2 py-0 h-[150px] sm:h-[80px] flex-wrap sm:flex-nowrap w-full bg-white flex justify-center items-center lg:justify-between shadow-md shadow-gray-100">
      {/* Logo */}
      <Link to="/" sx={{ textDecoration: "none" }}>
        <MdGamepad className="hidden text-4xl text-pink-500 sm:block" title="Gaming Ecommerce"/>
      </Link>

      {/* Search Box */}
      <div className="flex w-full lg:w-[500px] gap-2 items-center">
        <Link to="/" sx={{ textDecoration: "none" }}>
          <MdGamepad className="block text-4xl text-pink-500 sm:hidden" />
        </Link>
        <div className="flex-1 lg:w-[500px] h-[40px] sm:h-[50px]  rounded-full border hover:border-pink-500 p-2 flex items-center gap-2 bg-gray-100">
          <CiSearch className="text-xl cursor-pointer" onClick={searchForProducts} />
          <input
            className="flex-1 text-base text-gray-600 bg-gray-100 border-none outline-none"
            value={searchInput}
            onChange={(e) => dispatch(setSearchInput(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchForProducts();
              }
            }}
            placeholder="Search for Games and more"
          />
        </div>
      </div>

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

        {/* Wishlist */}
        {userUtils.isLoggedIn() && (
          <div className="flex flex-col items-center justify-center">
            <Link to="/wishlist" sx={{ textDecoration: "none" }}>
              <div className="flex flex-col items-center justify-center">
                <CiHeart className="text-2xl" />
                <div className="text-xs font-bold">Wishlist</div>
              </div>
            </Link>
          </div>
        )}

        {/* Cart */}
        {userUtils.isLoggedIn() && (
          <div className="flex flex-col items-center justify-center">
            <Link to="/checkout/cart" sx={{ textDecoration: "none" }}>
              <div className="relative flex flex-col items-center justify-center">
                <CiShoppingCart className="text-2xl" />
                <div className="text-xs font-bold">Cart</div>

                {cartSize > 0 && <div className="absolute grid w-5 h-5 text-xs font-bold text-white bg-red-400 rounded-full -right-2 -top-2 place-content-center">{cartSize}</div>}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
