import { useSelector } from "react-redux";

import NotificationBox from "../components/Common/Notification/NotificationBox";

import NavBar from "../components/NavBar/NavBar";

const Layout = ({ children }) => {
  
  const { notifications } = useSelector((state) => state.notificationSlice);

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
