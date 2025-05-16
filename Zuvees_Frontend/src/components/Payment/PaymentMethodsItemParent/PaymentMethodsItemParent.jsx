import React from "react";

const PaymentMethodsItemParent = ({ children, selectedPaymentMethod, setSelectedPaymentMethod, id }) => {
  return (
    <div onClick={()=>setSelectedPaymentMethod(id)} className="flex mb-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-pink-600">
      <div className="flex items-start p-2 pt-3">
        <div className="grid w-5 h-5 border border-pink-600 rounded-full place-content-center">
          {(selectedPaymentMethod === id) && (
            <div className="w-3 h-3 bg-pink-600 rounded-full">&nbsp;</div>
          ) } 
        </div>
      </div>
      <div className="flex-1 pt-3 overflow-hidden">{children}</div>
    </div>
  );
};

export default PaymentMethodsItemParent;
