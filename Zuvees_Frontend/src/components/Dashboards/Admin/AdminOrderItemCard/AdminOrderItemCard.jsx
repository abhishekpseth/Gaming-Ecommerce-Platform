import React from "react";

import { BiSolidDownArrow } from "react-icons/bi";

import DateTimeUtil from "../../../../Utils/DateTime/DateTime.util";

const AdminOrderItemCard = ({ orderItem, showProductDetails, setShowProductDetails, fetchOrders, selectedOrder, setSelectedOrder, setIsOrderStatusModalOpen, setIsRiderModalOpen }) => {
  return (
    <div className="sm:w-[500px] shadow-md shadow-gray-600 rounded-xl p-4 space-y-2 hover:scale-105">
      {/* First row */}
      <div className="flex justify-between gap-4">
        <div className="font-bold">
          Order ID: <span className="font-normal">{orderItem.orderID}</span>
        </div>
        <div className="font-bold">
          Ordered On: <span className="font-normal">{DateTimeUtil.convertToDateText(orderItem.createdAt)}</span>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap justify-between gap-2">
        <div className="font-bold">
          No of Products: <span className="font-normal">{orderItem.productListSize}</span>
        </div>
        <div className="font-bold">
          Total Amount: <span className="font-normal">{orderItem.totalAmount.toFixed(2)}</span>
        </div>
        <div className="font-bold">
          Payment Method: <span className="font-normal">{orderItem.paymentMethod}</span>
        </div>
        <div className="font-bold">
          Status: <span className="font-normal">{orderItem.status}</span>
        </div>

        {orderItem.riderID !== null && (
          <div className="font-bold">
            Rider:{" "}
            <span className="font-normal">
              {orderItem.riderName} ({orderItem.riderPhoneNumber})
            </span>
          </div>
        )}
      </div>

      {/* Third Row */}
      <div className="font-bold">
        Address: <span className="font-normal">{orderItem.address}</span>
      </div>

      {/* Fourth Row */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <div className="flex flex-col items-center justify-center gap-3 sm:items-stretch sm:gap-2 sm:justify-normal sm:flex-row">
          {/* Status */}
          <div
            onClick={() => {
              setSelectedOrder(orderItem);
              setIsOrderStatusModalOpen(true);
            }}
            className="cursor-pointer flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg"
          >
            Update Status
            <BiSolidDownArrow className="text-[8px]" />
          </div>

          {/* Rider */}
          <div
            onClick={() => {
              setSelectedOrder(orderItem);
              setIsRiderModalOpen(true);
            }}
            className="cursor-pointer flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg"
          >
            Update Rider
            <BiSolidDownArrow className="text-[8px]" />
          </div>
        </div>
        <button
          onClick={() => {
            if(!showProductDetails){
              setShowProductDetails(true);
              setSelectedOrder(orderItem);
            }else{
              if(selectedOrder?._id === orderItem?._id){
                setShowProductDetails(false);
                setSelectedOrder(null); 
              }else{
                setSelectedOrder(orderItem); 
              }
            }
          }}
          className="px-3 py-2 text-white bg-pink-600 rounded-lg"
        >
          Product Details
        </button>
      </div>
    </div>
  );
};

export default AdminOrderItemCard;
