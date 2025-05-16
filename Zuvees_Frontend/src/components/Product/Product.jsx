import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { TbActivityHeartbeat } from "react-icons/tb";

import CartService from "../../services/cart.service";
import ProductService from "../../services/product.service";
import WishlistService from "../../services/wishlist.service";

import useNotification from "../../custom-hooks/useNotification";

import { setCartSize } from "../../../slices/cartSlice";

import Loading from "../Common/Loading/Loading";
import jwtUtils from "../../Utils/jwt/jwt.util";
import userUtils from "../../Utils/User/User.util";

const Product = () => {
  const showNotification = useNotification();

  const { cartSize } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productID = queryParams.get("productID");
  const variantID = queryParams.get("variantID");

  const [variantDetails, setVariantDetails] = useState({});
  const [otherColorVariants, setOtherColorVariants] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleOtherVariantClick = (id) => {
    const url = `/products?productID=${productID}&variantID=${id}`;
    window.open(url, "_blank");
  };

  const addToWishlist = () => {
    setAddToWishlistLoading(true);
    WishlistService.addToWishlist(productID, variantID)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          showNotification("success", res.data.message);
          setIsWishlisted((prev) => !prev);
        } else {
          showNotification("error", "Couldn't add to wishlist");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(() => {
        setAddToWishlistLoading(false);
      });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotification("error", "Please select a size");
      return;
    }

    const removeFromWishlist = false;
    CartService.addToCart(productID, variantID, selectedSize, removeFromWishlist)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          showNotification("success", res.data.message);
          dispatch(setCartSize(cartSize + 1));
        } else {
          showNotification("error", "Couldn't add to cart");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showNotification("error");
      });
  };

  const fetchVariantDetails = () => {
    const token = JSON.parse(localStorage.getItem("user-info"))?.token;
    const userID = token ? jwtUtils.getJWTData(token)?._id : null;

    setLoading(true);
    ProductService.fetchVariantDetails(userID, productID, variantID)
      .then((res) => {
        if (res.status == 200) {
          setVariantDetails(res.data.variantDetails);
          setOtherColorVariants(res.data.OtherColorVariants);
          setAvailableSizes(res.data.availableSizes);
          setIsWishlisted(res.data.variantDetails.isWishlisted);
        } else {
          showNotification("Couldn't fetch Variant Details");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVariantDetails();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row w-full h-[calc(100%-20px)] px-5 py-0 lg:py-5 overflow-x-hidden overflow-y-auto custom-scrollbar">
      <div className="lg:w-[50%] flex flex-wrap gap-[20px] justify-center">
        {variantDetails?.imageSrc &&
          Array.isArray(variantDetails?.imageSrc) &&
          variantDetails?.imageSrc?.map((image, index) => (
            <img
              key={index}
              src={image}
              className="h-[300px] w-[200px] lg:h-[420px] lg:w-[320px]"
            />
          ))}
      </div>
      <div className="flex-1 lg:flex-auto lg:w-[50%] sm:px-5 flex flex-col gap-[20px]">
        <div>
          <div className="text-2xl font-bold text-gray-800">
            {variantDetails?.brand}
          </div>
          <div className="text-xl text-gray-500">{variantDetails?.name}</div>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          ₹{variantDetails?.price}
        </div>

        {otherColorVariants.length > 0 && (
          <div>
            <div className="text-lg font-bold text-gray-800">More Colors</div>
            <div className="flex flex-wrap">
              {otherColorVariants.map((variant) => (
                <img
                  key={variant.variantID}
                  src={variant.imageSrc}
                  className="h-[60px] w-[60px] cursor-pointer"
                  onClick={() => handleOtherVariantClick(variant.variantID)}
                  title={variant.color}
                />
              ))}
            </div>
          </div>
        )}

        {userUtils.isLoggedIn() && (
          <div>
            <div className="text-lg font-bold text-gray-800">Select Size</div>
            <div className="flex items-start gap-3">
              {availableSizes.map((size, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className="px-5 py-2 font-medium border border-pink-600 rounded-full cursor-pointer"
                  style={{
                    backgroundColor:
                      selectedSize === size
                        ? "oklch(59.2% 0.249 0.584)"
                        : "white",
                    color:
                      selectedSize === size
                        ? "white"
                        : "oklch(59.2% 0.249 0.584)",
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {userUtils.isLoggedIn() && (
          <div className="flex gap-[20px] flex-wrap">
            <button
              onClick={handleAddToCart}
              className="text-sm rounded-sm font-bold bg-pink-600 h-[50px] w-[300px] flex items-center justify-center gap-2 text-white cursor-pointer active:scale-95 transition-transform duration-100"
            >
              <CiShoppingCart className="text-xl" />
              ADD TO CART
            </button>

            <div
              onClick={addToWishlist}
              className="text-sm rounded-sm font-bold h-[50px] w-[300px] flex items-center justify-center gap-3 border text-gray-700 border-gray-300 hover:border-black cursor-pointer"
            >
              {addToWishlistLoading ? (
                <TbActivityHeartbeat className="text-2xl text-pink-600" />
              ) : isWishlisted === true ? (
                <FaHeart className="text-base text-pink-600" />
              ) : (
                <CiHeart className="text-xl" />
              )}
              <div className="text-gray-700">Wishlist</div>
            </div>
          </div>
        )}

        <div className="text-lg font-bold text-gray-800">
          Product Description:
        </div>
        <div>{variantDetails?.description}</div>
      </div>
    </div>
  );
};

export default Product;
