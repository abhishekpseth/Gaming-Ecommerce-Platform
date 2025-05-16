import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";

import { MdLogin } from "react-icons/md";
import { MdLogout } from "react-icons/md";

import LoginService from "../../../services/login.service";

import useNotification from "../../../custom-hooks/useNotification";

import userUtils from "../../../Utils/User/User.util";

const ProfileModal = () => {
  const navigate = useNavigate();

  const showNotification = useNotification();

  const [userDetails, setUserDetails] = useState(null);

  const loadUserDetails = () => {
    const storedUser = JSON.parse(localStorage.getItem("user-info"));

    if (userUtils.isLoggedIn()) {
      setUserDetails({
        name: storedUser?.name,
        email: storedUser?.email,
        imageSrc: storedUser?.imageSrc,
      });
    } else {
      setUserDetails(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    showNotification("success", "You're Logged out");
    navigate("/");
  };

  const responseGoogle = (authResult) => {
    if (authResult["code"]) {
      LoginService.login(authResult.code)
        .then((res) => {
          if (res.status === 200) {
            const { email, name } = res.data.user;
            const imageSrc = res.data.profileImgURL;
            const token = res.data.token;
            const obj = { email, name, token, imageSrc };
            localStorage.setItem("user-info", JSON.stringify(obj));
            loadUserDetails();
            showNotification("success", "Logged In successfully");
          } else {
            showNotification("error", "Couldn't Log In");
          }
        })
        .catch((error) => {
          console.log(error);
          showNotification("error");
        });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  useEffect(() => {
    loadUserDetails();

    const handleStorageChange = (event) => {
      if (event.key === "user-info") {
        loadUserDetails();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-w-[200px] sm:w-[300px] z-50 bg-white absolute top-full shadow-md shadow-gray-300 p-5 flex flex-col gap-4 translate-x-[-80%]">
      <div className="flex gap-2 overflow-hidden">
        {userUtils.isLoggedIn() && userDetails?.imageSrc && (
          <img
            src={userDetails.imageSrc}
            alt="User profile"
            className="w-12 h-12 rounded-full "
          />
        )}
        <div className="flex flex-col">
          <div className="text-[14px] font-bold text-gray-800">
            {userUtils.isLoggedIn() ? `Hello, ${userDetails?.name}` : "Welcome"}
          </div>
          <div className="text-[13px] text-gray-600 break-words">
            {userUtils.isLoggedIn()
              ? userDetails?.email
              : "To access account and manage orders"}
          </div>
        </div>
      </div>

      {!userUtils.isLoggedIn() && (
        <div
          onClick={googleLogin}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-pink-600 border border-gray-200 cursor-pointer w-max hover:border-pink-600"
        >
          <MdLogin className="text-lg" />
          LOGIN/SIGNUP
        </div>
      )}
      <div className="w-full h-[1px] bg-gray-200">&nbsp;</div>
      
      {/* Logout */}
      {userUtils.isLoggedIn() && (
        <div className="flex items-start">
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 cursor-pointer group hover:py-1 hover:px-3 hover:text-white hover:bg-red-500 hover:rounded-lg"
          >
            <MdLogout className="hidden group-hover:inline" />
            Log out
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
