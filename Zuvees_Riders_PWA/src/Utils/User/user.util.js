import jwtUtils from "../jwt/jwt.util";

const isLoggedIn = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user-info"));
    return !!(storedUser && jwtUtils.checkTokenValid(storedUser.token));
  } catch (error) {
    return false;
  }
};

const userUtils = {
  isLoggedIn,
}

export default userUtils;