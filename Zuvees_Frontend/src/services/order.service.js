import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Order_Route = `${API_BASE_URL}/api/order`;

const createOrder = async (products, address, paymentMethod, totalAmount) => {
  try {
    const endPoint = "/";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      products, 
      address, 
      paymentMethod, 
      totalAmount
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

const fetchAll = async (selectedDataPeriodValue, page, limit) => {
  try {
    const endPoint = "/";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const params = {
      selectedDataPeriodValue,
      page, 
      limit
    }

    const response = await axios.get(API_URL, {
      headers,
      params
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const getOrdersDetails = async (selectedDataPeriodValue, page, limit) => {
  try {
    const endPoint = "/ordersDetails";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const params = {
      selectedDataPeriodValue,
      page,
      limit
    }

    const response = await axios.get(API_URL, {
      params,
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const getProductDetailsOfOrder = async (orderID) => {
  try {
    const endPoint = "/productDetailsOfOrder";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const params = {
      orderID
    }

    const response = await axios.get(API_URL, {
      params,
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const updateRider = async (orderID, riderID) => {
  try {
    const endPoint = "/rider";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      orderID, 
      riderID
    }

    const response = await axios.put(API_URL, body, {
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const updateStatus = async (orderID, status) => {
  try {
    const endPoint = "/status";
    const API_URL = `${Order_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      orderID, 
      status
    }
    
    const response = await axios.put(API_URL, body, {
      headers
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const OrderService = {
  createOrder,
  fetchAll,
  getOrdersDetails,
  getProductDetailsOfOrder,
  updateRider,
  updateStatus
};

export default OrderService;
