import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const User_Route = `${API_BASE_URL}/api/user`;

const fetchAllAddresses = async () => {
  try {
    const endPoint = "/addresses";
    const API_URL = `${User_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const response = await axios.get(API_URL, {
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const addAddress = async (addressObject) => {
  try {
    const endPoint = "/address";
    const API_URL = `${User_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = addressObject
    
    const response = await axios.post(API_URL, body, {
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const deleteAddress = async (addressID) => {
  try {
    const endPoint = "/deleteAddress";
    const API_URL = `${User_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      addressID
    }
    
    const response = await axios.post(API_URL, body, {
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const UserService = {
  fetchAllAddresses,
  addAddress,
  deleteAddress
};

export default UserService;
