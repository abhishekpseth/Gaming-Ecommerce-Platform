import { jwtDecode } from "jwt-decode";

const checkTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};

const getJWTData =(token)=>{
  const decodedData = checkTokenValid(token) ? jwtDecode(token) : null;
  return decodedData;
}

const jwtUtils = {
  checkTokenValid,
  getJWTData
}

export default jwtUtils;