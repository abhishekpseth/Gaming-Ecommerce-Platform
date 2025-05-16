import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Login_Route = `${API_BASE_URL}/api/login`;

const login = async (code) => {
  try {
    const endPoint = "/";
    const API_URL = `${Login_Route}${endPoint}`;

    const body = {
      googleCode: code
    }
    const response = await axios.post(API_URL, body);
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const LoginService = {
  login,
};

export default LoginService;
