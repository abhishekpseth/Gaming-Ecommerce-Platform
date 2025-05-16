import React, { useEffect, useState } from "react";

import { RxCross1 } from "react-icons/rx";

import OrderService from "../../../../services/order.service";
import RiderService from "../../../../services/rider.service";

import useNotification from "../../../../custom-hooks/useNotification";

import Loading from "../../../Common/Loading/Loading";
import LoadingLight from "../../../Common/LoadingLight/LoadingLight";

const UpdateRiderModal = ({dbOrderID, selectedOrderRiderID, fetchOrders, setSelectedOrder, setIsRiderModalOpen}) => {
  const showNotification = useNotification();
  
  const [selectedRider, setSelectedRider] = useState(selectedOrderRiderID);
  const [loading, setLoading] = useState(false);
  const [riders, setRiders] = useState([]);
  const [fetchRiderLoading, setFetchRiderLoading] = useState(false);
  
  const fetchRiders = () => {
    setFetchRiderLoading(true);
    RiderService.fetchAll()
      .then((res) => {
        if(res.status === 200){
          setRiders(res?.data?.riders || []);
        }else{
          showNotification("error", "Couldn't fetch Riders");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error", "Couldn't fetch Riders");
      })
      .finally(()=>{
        setFetchRiderLoading(false);
      });
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const updateOrder = () => {
    setLoading(true);
    OrderService.updateRider(dbOrderID, selectedRider)
      .then((res) => {
        if(res.status === 200){
          fetchOrders();
          showNotification("success", "Rider updated successfully");
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
      <div className="bg-white max-w-[300px] w-full p-4 h-fit rounded-md relative">
        {/* Top Part */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Change Rider</div>
          <RxCross1
            onClick={() => {
              setIsRiderModalOpen(false);
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
          {/* Select Rider */}
          <div className="flex flex-wrap items-start justify-start gap-3">
            {fetchRiderLoading ? (
              <div className="relative min-h-[100px] w-full grid place-content-center">
                <Loading />
              </div>
            ) : (
              riders.map((rider, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedRider(rider.riderID)}
                  className="grid px-3 py-2 font-medium border border-pink-600 rounded-full cursor-pointer place-content-center "
                  style={{
                    backgroundColor: selectedRider === rider.riderID ? "oklch(59.2% 0.249 0.584)" : "white",
                    color: selectedRider === rider.riderID ? "white" : "oklch(59.2% 0.249 0.584)",
                  }}
                >
                  {rider.name}
                </div>
              ))
            )}
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


export default UpdateRiderModal;
