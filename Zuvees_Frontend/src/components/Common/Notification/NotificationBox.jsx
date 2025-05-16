import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { FaBell } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { RiWifiOffLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { BiSolidMessageSquareMinus } from "react-icons/bi";

import { deleteNotification } from "../../../../slices/notificationSlice";

import PartialCircle from "./PartialCircle/PartialCircle";

const NotificationBox = ({ index, id, type = "message", label }) => {
  const dispatch = useDispatch();

  const autoCloseTime = 4000;
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prev) => prev + 100);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (time > autoCloseTime + 1000) {
      dispatch(deleteNotification(id));
    }
  }, [time]);

  let notificationProperties = null;

  switch (type) {
    case "success":
      notificationProperties = {
        icon: <FaCheck />,
        backgroundColor: "#16a34a",
      };
      break;
    case "error":
      notificationProperties = {
        icon: <RxCross2 />,
        backgroundColor: "#ef4444",
      };
      break;
    case "warning":
      notificationProperties = {
        icon: <IoWarningOutline />,
        backgroundColor: "#facc15",
      };
      break;
    case "info":
      notificationProperties = {
        icon: <FaBell />,
        backgroundColor: "#6d28d9",
      };
      break;
    case "message":
      notificationProperties = {
        icon: <BiSolidMessageSquareMinus />,
        backgroundColor: "#2563eb",
      };
      break;
    case "offline":
      notificationProperties = {
        icon: <RiWifiOffLine />,
        backgroundColor: "#ef4444",
      };
      break;
    default:
      notificationProperties = [];
  }

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`absolute transition-transform duration-300 ease-in-out transform -translate-x-1/2 hover:scale-105 rounded-[20px] flex items-center gap-[10px] cursor-pointer overflow-hidden left-[50%] z-[100]`}
      style={{
        ...(isSmallScreen ? { top: `${(index + 1) * 30}px`, width: "90%" } : { top: `${(index + 1) * 60}px` }),
        maxWidth: isSmallScreen ? "80%" : "90%",
        padding: isSmallScreen ? "2px 2px" : "10px 20px",
        backgroundColor: notificationProperties.backgroundColor,
      }}
    >
      <PartialCircle percentage={(1 - time / autoCloseTime) * 100} strokeWidth={2} radius={isSmallScreen ? 12 : 15}>
        {notificationProperties.icon}
      </PartialCircle>
      <div
        className="flex-grow text-white whitespace-normal"
        style={{
          fontSize: isSmallScreen && "12px",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default NotificationBox;
