import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_FRONTEND_DASHBOARD_API_BASE_URL;

const Product_Route = `${API_BASE_URL}/api/product`;

const fetchAll = async (userID, searchInput, selectedColors, selectedSizes, selectedSortingOptionID, page, limit) => {
  try {
    const endPoint = "/";
    const API_URL = `${Product_Route}${endPoint}`;

    const params = {
      userID,
      searchInput,
      selectedColors: selectedColors.join(','),
      selectedSizes: selectedSizes.join(','),
      selectedSortingOptionID,
      page, 
      limit
    }
    const response = await axios.get(API_URL, {
      params,
    });

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const fetchAllFiltersDropdown = async () => {
  try {
    const endPoint = "/filtersDropdown";
    const API_URL = `${Product_Route}${endPoint}`;

    const response = await axios.get(API_URL);

    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const fetchVariantDetails = async (userID, productID, variantID) => {
  try {
    const endPoint = "/variant";
    const API_URL = `${Product_Route}${endPoint}`;
    
    const params = {
      userID,
      productID,
      variantID
    }

    const response = await axios.get(API_URL, { 
      params,
     });

    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

const ProductService = {
  fetchAll,
  fetchAllFiltersDropdown,
  fetchVariantDetails
};

export default ProductService;
