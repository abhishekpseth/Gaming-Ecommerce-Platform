import React from "react";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

const PriceSummation = ({ totalMRP, platformFee }) => {
  const { cartSize } = useSelector((state) => state.cartSlice);
  const { addressObject } = useSelector((state) => state.userSlice);

  let totalAmount = Number(totalMRP) + Number(platformFee);
  totalAmount = totalAmount.toFixed(2);

  return (
    <div className="flex flex-col sm:w-[400px] h-full gap-3 px-0 py-6">
      <div className="text-xs font-bold text-gray-800">PRICE DETAILS ({cartSize} Items)</div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">Total MRP</div>
          <div className="text-sm text-gray-600">₹ {totalMRP}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">Platform Fee</div>
          <div className="text-sm text-gray-600">₹ {platformFee}</div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-[-2px] text-sm text-gray-600">
            Shipping Fee
            <div className="text-[12px] text-gray-400">Free shipping for you</div>
          </div>
          <div className="text-sm text-green-600">FREE</div>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px]">&nbsp;</div>
      <div className="flex justify-between">
        <div className="text-base font-bold text-gray-600">Total Amount</div>
        <div className="text-base font-bold text-gray-600">₹ {totalAmount}</div>
      </div>

      {addressObject !== null && cartSize>0 && (
        <button className="py-2 font-bold text-white bg-pink-600 rounded-md">
          <Link to="/checkout/payment" sx={{ textDecoration: "none" }}>
            <div className="w-full h-full">PLACE ORDER</div>
          </Link>
        </button>
      )}
    </div>
  );
};

export default PriceSummation;
