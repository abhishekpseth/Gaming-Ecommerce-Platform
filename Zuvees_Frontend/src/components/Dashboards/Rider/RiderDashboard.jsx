import React, { useEffect, useState } from "react";

import useNotification from "../../../custom-hooks/useNotification";

import RiderService from "../../../services/rider.service";

import Loading from "../../Common/Loading/Loading";
import SelectBox from "../../Common/SelectBox/SelectBox";
import RiderOrderItemCard from "./RiderOrderItemCard/RiderOrderItemCard";
import ChangeStatusModal from "../Admin/ChangeStatusModal/ChangeStatusModal";
import PaginationComponent from "../../Common/PaginationComponent/PaginationComponent";
import ProductDetailsModal from "../../Orders/ProductDetailsModal/ProductDetailsModal";

const RiderDashboard = () => {
  const showNotification = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [selectedDataPeriod, setSelectedDataPeriod] = useState({
    name: "All",
    value: "All",
  });

  const fetchOrders = (page, limit) => {
    setLoading(true);
    const selectedDataPeriodValue = selectedDataPeriod?.value;
    RiderService.fetchOrdersByRider(selectedDataPeriodValue, page, limit)
    .then((res) => {
      if(res.status === 200){
        setOrders(res?.data?.orders || []);
        setTotalDataCount(res?.data?.totalDataCount); 
      }else if(res.status === 403){
        showNotification("warning", "You're not authorized to view this");
      }else{
        showNotification("error", "Couldn't fetch Orders"); 
      }
    })
    .catch((error) => {
      console.log(error);
      showNotification("error", "Couldn't fetch Orders"); 
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const paginate =(pageNumber)=>{
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber, dataPerPage);
  }

  const handleChangeDataPeriod = (period) => {
    setSelectedDataPeriod(period);
  };
  
  useEffect(() => {
    fetchOrders(currentPage, dataPerPage);
  }, []);

  useEffect(() => {
    fetchOrders(currentPage, dataPerPage);
  }, [selectedDataPeriod]);
  
  if (loading) {
    return <div className="relative w-full h-full">
      <Loading />
    </div>;
  }

  return (
    <div className="relative pb-[60px] h-full overflow-hidden">
      <div className="h-full p-4 overflow-x-hidden overflow-y-auto bg-white sm:p-8 custom-scrollbar">
        <div className="flex flex-wrap items-center justify-between py-2">
          <h1 className="mb-6 text-2xl font-bold text-gray-600">Rider Dashboard</h1>
          <SelectBox
            label="Period"
            optionName="name"
            optionValue="value"
            options={[
              {
                name: "Today",
                value: "today",
              },
              {
                name: "Last 7 days",
                value: "sevenDays",
              },
              {
                name: "This Month",
                value: "thisMonth",
              },
              {
                name: "This Year",
                value: "thisYear"
              },
              {
                name: "All",
                value: "All"
              }
            ]}
            value={selectedDataPeriod}
            handleChange={(option) => handleChangeDataPeriod(option)}
          />
        </div>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders available.</div>
        ) : (
          <div className="flex flex-col flex-1 gap-[40px] p-2 relative bg-white items-center transition-transform duration-300 ease-in-out">
            {orders.map((item, index) => (
              <RiderOrderItemCard
                key={index}
                orderItem={item}
                showProductDetails={showProductDetails}
                setShowProductDetails={setShowProductDetails}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                setIsOrderStatusModalOpen={setIsOrderStatusModalOpen}
              />
            ))}
          </div>
        )}
      </div>
      
      {!loading && orders.length > 0 && <PaginationComponent currentPage={currentPage} totalDataCount={totalDataCount} dataPerPage={dataPerPage} paginate={paginate} />}

      <ProductDetailsModal dbOrderID={selectedOrder?._id} showProductDetails={showProductDetails} setShowProductDetails={setShowProductDetails} setSelectedOrder={setSelectedOrder} />
      
      {isOrderStatusModalOpen && (
        <ChangeStatusModal dbOrderID={selectedOrder?._id} selectedOrderStatus={selectedOrder?.status} statusOptions={["Shipped", "Delivered", "Undelivered"]} fetchOrders={()=>fetchOrders(currentPage, dataPerPage)} setSelectedOrder={setSelectedOrder} setIsOrderStatusModalOpen={setIsOrderStatusModalOpen}/>
      )}
    </div>
  );
};

export default RiderDashboard;
