import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { MdCancel } from "react-icons/md";

import CartService from "../../../services/cart.service";

import { setCartSize } from "../../../../slices/cartSlice";

import useNotification from "../../../custom-hooks/useNotification";

import LoadingLight from "../../Common/LoadingLight/LoadingLight";

const MoveToCartModal = ({ selectedWishlistedItem, setSelectedWishlistedItem, getWishlist }) => {
  const showNotification = useNotification();

  const { cartSize } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();
  
  const availableSizes = selectedWishlistedItem?.availableSizes;

  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);

    const removeFromWishlist = true;
    CartService.addToCart(selectedWishlistedItem?.productID, selectedWishlistedItem?.variantID, selectedSize, removeFromWishlist)
      .then((res) => {
        if (res.status === 201) {
          showNotification("success", "Added to Cart");
          getWishlist();
          setSelectedWishlistedItem(null);
          dispatch(setCartSize(cartSize + 1));
        } else {
          showNotification("error", "Couldn't add to cart");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showNotification("error");
      })
      .finally(()=>{
        setLoading(false);
      })
  };

  return (
    <div
      className="absolute top-0 left-0 z-30 w-full h-screen px-4 pt-[100px] sm:pt-[140px] overflow-hidden flex justify-center"
      style={{
        backgroundColor: "rgba(83, 83, 83, 0.35)",
      }}
    >
      <div className="bg-white max-w-[500px] w-full h-fit p-4 rounded-md relative">
        {/* Top Part */}
        <div className="flex items-center gap-5">
          {/* Image */}
          <img className="max-w-[80px] aspect-square rounded-lg" src={selectedWishlistedItem.imageSrc[0]} />

          {/* Details */}
          <div className="flex flex-col gap-1">
            <div className="flex-1 text-lg font-bold text-gray-600">
              {selectedWishlistedItem?.brand} {selectedWishlistedItem.name}
            </div>
            <div className="text-lg font-bold">₹ {selectedWishlistedItem.price}</div>
          </div>

          {/* Cancel icon */}
          <div className="absolute right-4 top-4">
            <MdCancel
              onClick={()=>setSelectedWishlistedItem(null)}
              className="w-6 h-6 text-gray-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center w-full h-8">
          <div className="w-full h-[1px] bg-gray-300">&nbsp;</div>
        </div>

        {/* Bottom Part */}
        <div className="flex flex-col gap-5">
          {/* Select Sizes */}
          <div className="flex flex-col gap-3">
            <div className="text-lg font-bold text-gray-800">Select Size</div>
            <div className="flex flex-wrap items-start gap-3">
              {availableSizes.map((size, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className="px-5 py-2 font-medium border border-pink-600 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: selectedSize === size ? "oklch(59.2% 0.249 0.584)" : "white",
                    color: selectedSize === size ? "white" : "oklch(59.2% 0.249 0.584)",
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Button */}
          <button onClick={handleAddToCart} className="flex items-center justify-center w-full gap-2 py-3 text-white bg-pink-600 rounded-md">
            {loading && (
              <div className="relative w-4 h-4">
                <LoadingLight />
              </div>
            )} 
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToCartModal;
