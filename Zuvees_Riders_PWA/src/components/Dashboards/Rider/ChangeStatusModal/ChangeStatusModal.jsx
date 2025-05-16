import React, { useState } from "react";

import { RxCross1 } from "react-icons/rx";

import OrderService from "../../../../services/order.service";

import useNotification from "../../../../custom-hooks/useNotification";

import LoadingLight from "../../../Common/LoadingLight/LoadingLight";

const ChangeStatusModal = ({dbOrderID, selectedOrderStatus, statusOptions, fetchOrders, setSelectedOrder, setIsOrderStatusModalOpen}) => {
  const showNotification = useNotification();
  const [selectedStatus, setSelectedStatus] = useState(selectedOrderStatus);
  const [loading, setLoading] = useState(false);
  
  const updateOrder = () => {
    setLoading(true);
    OrderService.updateStatus(dbOrderID, selectedStatus)
      .then((res) => {
        if(res.status === 200){
          fetchOrders();
          showNotification("success", "Order status updated successfully");
        }else{
          showNotification("error", "Couldn't update order");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(()=>{
        setLoading(false);
      });
  };
  return (
    <div
      className="absolute top-0 left-0 z-30 w-full h-screen px-4 pt-[160px] overflow-hidden flex justify-center"
      style={{
        backgroundColor: "rgba(83, 83, 83, 0.35)",
      }}
    >
      <div className="bg-white max-w-[300px] w-full h-fit p-4 rounded-md relative">
        {/* Top Part */}
        <div className="flex items-center justify-between jus">
          <div className="text-lg font-bold">Change Status</div>
          <RxCross1
            onClick={() => {
              setIsOrderStatusModalOpen(false);
              setSelectedOrder(null);
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
          {/* Select Status */}
          <div className="flex flex-wrap items-start justify-start gap-3">
            {statusOptions.map((status, index) => (
              <div
                key={index}
                onClick={() => setSelectedStatus(status)}
                className="grid px-3 py-2 font-medium border border-pink-600 rounded-full cursor-pointer place-content-center "
                style={{
                  backgroundColor: selectedStatus === status ? "oklch(59.2% 0.249 0.584)" : "white",
                  color: selectedStatus === status ? "white" : "oklch(59.2% 0.249 0.584)",
                }}
              >
                {status}
              </div>
            ))}
          </div>

          {/* Confirmation Button */}
          <button onClick={updateOrder} className="flex items-center justify-center w-full gap-2 py-3 text-white bg-pink-600 rounded-md">
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

export default ChangeStatusModal;