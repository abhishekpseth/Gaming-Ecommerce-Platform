import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Rider_Route = `${API_BASE_URL}/api/rider`;

const fetchAll = async () => {
  try {
    const endPoint = "/";
    const API_URL = `${Rider_Route}${endPoint}`;

    const headers = {
      Authorization: JSON.parse(localStorage.getItem("user-info")).token,
    };

    const response = await axios.get(API_URL, {
      headers,
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const fetchOrdersByRider = async (selectedDataPeriodValue, page, limit) => {
  try {
    const endPoint = "/ordersByRider";
    const API_URL = `${Rider_Route}${endPoint}`;

    const headers = {
      Authorization: JSON.parse(localStorage.getItem("user-info")).token,
    };

    const params = {
      selectedDataPeriodValue,
      page,
      limit,
    };

    const response = await axios.get(API_URL, {
      params,
      headers,
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const RiderService = {
  fetchAll,
  fetchOrdersByRider,
};

export default RiderService;
