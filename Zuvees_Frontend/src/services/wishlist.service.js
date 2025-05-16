import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Wishlist_Route = `${API_BASE_URL}/api/wishlist`;

const fetchAll = async () => {
  try {
    const endPoint = "/";
    const API_URL = `${Wishlist_Route}${endPoint}`;

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

const addToWishlist = async (productID, variantID) => {
  try {
    const endPoint = "/";
    const API_URL = `${Wishlist_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      productID, 
      variantID
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

const removeFromWishlist = async (productID, variantID) => {
  try {
    const endPoint = "/remove";
    const API_URL = `${Wishlist_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      productID, 
      variantID
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

const WishlistService = {
  fetchAll,
  addToWishlist,
  removeFromWishlist
};

export default WishlistService;
