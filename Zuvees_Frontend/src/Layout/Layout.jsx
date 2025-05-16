import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import CartService from "../services/cart.service";

import { setCartSize } from "../../slices/cartSlice";

import useNotification from "../custom-hooks/useNotification";
import NotificationBox from "../components/Common/Notification/NotificationBox";

import NavBar from "../components/NavBar/NavBar";
import userUtils from "../Utils/User/User.util";

const Layout = ({ children }) => {
  const showNotification = useNotification();
  
  const { notifications } = useSelector((state) => state.notificationSlice);

  const dispatch = useDispatch();

  const getCartSizeForUser = () => {
    CartService.cartSize()
      .then((res) => {
        if (res.status === 200) {
          dispatch(setCartSize(res?.data?.cartSize || 0));
        } else {
          showNotification("error", "Couldn't fetch cart size");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };

  useEffect(() => {
    if (userUtils.isLoggedIn()) {
      getCartSizeForUser();
    } else {
      dispatch(setCartSize(0));
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 h-[100vh] bg-white overflow-hidden">
      {/* NavBar */}
      <NavBar />

      <div className="relative flex-1 overflow-hidden">
        {/* Remaining Portion */}
        {children}

        {/* Notifications */}
        {notifications.length > 0 &&
          notifications.map((notification, index) => <NotificationBox key={notification.id} id={notification.id} index={index} type={notification.type} label={`${notification.label}`} />)}
      </div>
    </div>
  );
};

export default Layout;
