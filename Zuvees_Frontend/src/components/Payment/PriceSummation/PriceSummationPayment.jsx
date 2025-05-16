import React from "react";

import { useSelector } from "react-redux";

const PriceSummationPayment = ({ totalMRP, platformFee, selectedPaymentMethod }) => {
  const { cartSize } = useSelector((state) => state.cartSlice);

  const codFee = 10;
  let totalAmount  = Number(totalMRP) + Number(platformFee) + (selectedPaymentMethod === "cod" ? Number(codFee) : 0);
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
        {selectedPaymentMethod === "cod" && (
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">Cash/Pay on Delivery Fee</div>
            <div className="text-sm text-gray-600">{codFee}</div>
          </div>
        )}
      </div>
      <div className="bg-gray-200 w-full h-[1px]">&nbsp;</div>
      <div className="flex justify-between">
        <div className="text-base font-bold text-gray-600">Total Amount</div>
        <div className="text-base font-bold text-gray-600">₹ {totalAmount}</div>
      </div>
    </div>
  );
};

export default PriceSummationPayment;
