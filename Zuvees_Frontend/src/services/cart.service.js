import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Cart_Route = `${API_BASE_URL}/api/cart`;

const addToCart = async (productID, variantID, size, removeFromWishlist) => {
  try {
    const endPoint = "/";
    const API_URL = `${Cart_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      productID, 
      variantID, 
      size,
      removeFromWishlist
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

const fetchCartItems = async () => {
  try {
    const endPoint = "/";
    const API_URL = `${Cart_Route}${endPoint}`;

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

const cartSize = async () => {
  try {
    const endPoint = "/cartSize";
    const API_URL = `${Cart_Route}${endPoint}`;

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

const updateSizeInCartItem = async (cartID, newSize) => {
  try {
    const endPoint = "/cartSize";
    const API_URL = `${Cart_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      cartID,
      newSize,
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

const updateQuantityInCartItem = async (cartID, newQuantity) => {
  try {
    const endPoint = "/quantity";
    const API_URL = `${Cart_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const body = {
      cartID,
      newQuantity
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

const deleteCartItem = async (cartID) => {
  try {
    const endPoint = "/";
    const API_URL = `${Cart_Route}${endPoint}`;

    const headers = { Authorization: JSON.parse(localStorage.getItem("user-info")).token };

    const params = {
      cartID
    }

    const response = await axios.delete(API_URL, {
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

const CartService = {
  addToCart,
  fetchCartItems,
  cartSize,
  updateSizeInCartItem,
  updateQuantityInCartItem,
  deleteCartItem
};

export default CartService;
