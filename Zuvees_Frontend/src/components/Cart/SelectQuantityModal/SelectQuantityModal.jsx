import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RxCross1 } from "react-icons/rx";

import CartService from "../../../services/cart.service";

import { setCartSize } from "../../../../slices/cartSlice";

import useNotification from "../../../custom-hooks/useNotification";

import LoadingLight from "../../Common/LoadingLight/LoadingLight";

const SelectQuantityModal = ({ selectedCartItem, setSelectedCartItem, setIsSelectQuantityModalOpen, getCart }) => {
  const showNotification = useNotification();

  const { cartSize } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();

  const stockSize = selectedCartItem?.stockSize;

  const limit = stockSize > 10 ? 10 : stockSize;

  const stockSizeArray = Array.from({ length: limit }, (_, i) => i + 1);

  const initialQuantity = selectedCartItem?.quantity;
  const [selectedQuantity, setSelectedQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(false);

  const updateQuantityInCartItem = () => {
    setLoading(true);
    CartService.updateQuantityInCartItem(selectedCartItem.cartID, selectedQuantity)
      .then((res) => {
        if (res.status === 200) {
          showNotification("success", "Updated quantity successfully");
          dispatch(setCartSize(cartSize - initialQuantity + selectedQuantity));
          getCart();
          setIsSelectQuantityModalOpen(false);
          setSelectedCartItem(null);
        } else {
          showNotification("error", "Couldn't update quantity");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showNotification("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="absolute top-0 left-0 z-30 w-full h-screen px-4 pt-[100px] sm:pt-[140px] overflow-hidden flex justify-center"
      style={{
        backgroundColor: "rgba(83, 83, 83, 0.35)",
      }}
    >
      <div className="bg-white max-w-[300px] w-full h-fit p-4 rounded-md relative">
        {/* Top Part */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Select Quantity</div>
          <RxCross1
            onClick={() => {
              setIsSelectQuantityModalOpen(false);
              setSelectedCartItem(null);
            }}
            className="text-lg cursor-pointer"
          />
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center w-full h-6">
          <div className="w-full h-[1px] bg-gray-300">&nbsp;</div>
        </div>

        {/* Bottom Part */}
        <div className="flex flex-col gap-5">
          {/* Select Sizes */}
          <div className="grid items-start grid-cols-5 gap-3">
            {stockSizeArray.map((quantity, index) => (
              <div
                key={index}
                onClick={() => setSelectedQuantity(quantity)}
                className="grid px-2 py-2 font-medium border border-pink-600 rounded-full cursor-pointer place-content-center"
                style={{
                  backgroundColor: selectedQuantity === quantity ? "oklch(59.2% 0.249 0.584)" : "white",
                  color: selectedQuantity === quantity ? "white" : "oklch(59.2% 0.249 0.584)",
                }}
              >
                {quantity}
              </div>
            ))}
          </div>

          {/* Confirmation Button */}
          <button onClick={updateQuantityInCartItem} className="flex items-center justify-center w-full gap-2 py-3 text-white bg-pink-600 rounded-md">
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

export default SelectQuantityModal;
