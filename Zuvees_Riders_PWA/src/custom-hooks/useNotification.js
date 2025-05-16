import { useDispatch } from "react-redux";

import { Notification } from "../../slices/notificationSlice";

const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (type, label) => {
    if (!label) {
      dispatch(
        Notification({
          type: type,
          label: "We are facing some technical issue",
        })
      );
    }else {
      dispatch(
        Notification({
          type: type,
          label: label,
        })
      );
    }
  };

  return showNotification;
};

export default useNotification;