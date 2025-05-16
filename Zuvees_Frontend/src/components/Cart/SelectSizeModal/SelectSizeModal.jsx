import React, { useState } from "react";

import { MdCancel } from "react-icons/md";

import CartService from "../../../services/cart.service";

import useNotification from "../../../custom-hooks/useNotification";

import LoadingLight from "../../Common/LoadingLight/LoadingLight";

const SelectSizeModal = ({ selectedCartItem, setSelectedCartItem, setIsSelectSizeModalOpen, getCart }) => {
  const showNotification = useNotification();
   
  const availableSizes = selectedCartItem?.availableSizes;

  const [selectedSize, setSelectedSize] = useState(selectedCartItem.size);
  const [loading, setLoading] = useState(false);

  const updateSizeInCartItem = () => {
    setLoading(true);
    CartService.updateSizeInCartItem(selectedCartItem.cartID, selectedSize)
      .then((res) => {
        if (res.status === 200) {
          showNotification("success", "Updated size successfully");
          getCart();
          setIsSelectSizeModalOpen(false);
          setSelectedCartItem(null);
        } else {
          showNotification("error", "Couldn't update size");
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
          <img className="max-w-[80px] aspect-square rounded-lg" src={selectedCartItem?.images[0]} />

          {/* Details */}
          <div className="flex flex-col gap-1">
            <div className="flex-1 text-gray-600">
              {selectedCartItem?.brand} {selectedCartItem.productName}
            </div>
            <div className="text-lg font-bold">₹ {selectedCartItem.price}</div>
          </div>

          {/* Cancel icon */}
          <div className="absolute right-4 top-4">
            <MdCancel
              onClick={() => {
                setIsSelectSizeModalOpen(false);
                setSelectedCartItem(null);
              }}
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
            <div className="flex items-start gap-3">
              {availableSizes &&
                Array.isArray(selectedCartItem?.availableSizes) &&
                selectedCartItem?.availableSizes.map((size, index) => (
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
          <button
            onClick={updateSizeInCartItem}
            className="flex items-center justify-center w-full gap-2 py-3 text-white bg-pink-600 rounded-md"
          >
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

export default SelectSizeModal;
