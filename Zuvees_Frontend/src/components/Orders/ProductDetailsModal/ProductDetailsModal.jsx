import React, { useEffect, useState } from "react";

import { RxCross1 } from "react-icons/rx";

import OrderService from "../../../services/order.service";

import useNotification from "../../../custom-hooks/useNotification";

import Loading from "../../Common/Loading/Loading";

const ProductDetailsModal = ({ dbOrderID, showProductDetails=true, setShowProductDetails, setSelectedOrder }) => {
  const showNotification = useNotification();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProductDetails = () => {
    if(!dbOrderID)return;
    setLoading(true);
    OrderService.getProductDetailsOfOrder(dbOrderID)
      .then((res) => {
        if (res.status === 200) {
          setProducts(res?.data?.products);
        } else {
          showNotification("error", "Couldn't fetch products");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showProductDetails) {
      getProductDetails();
    }
  }, [showProductDetails, dbOrderID]);

  return (
    <div
      className={`absolute left-0 bottom-0 sm:left-auto sm:bottom-auto top-auto right-auto sm:top-0 sm:right-0 w-full sm:w-auto h-auto max-h-full sm:h-full px-2 sm:px-4 py-2 pb-10 overflow-auto duration-300 ease-in-out bg-gray-100 custom-scrollbar ${
        showProductDetails ? "translate-y-0 sm:translate-y-unset sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 text-base font-bold text-gray-800">PRODUCT DETAILS</div>
        <RxCross1
          onClick={() => {
            setShowProductDetails(false);
            setSelectedOrder(null);
          }}
          className="text-lg cursor-pointer"
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="h-full px-2">
          {products.map((product, index) => (
            <div key={index} className="relative mb-2 flex p-5 rounded-xl border border-gray-200 min-h-[160px] bg-white">
              <div>
                <img src={product.images[0]} className="h-full max-w-32" />
              </div>
              <div className="flex flex-col gap-3 p-2 px-4">
                <div className="flex flex-col">
                  {/* <div className="text-sm font-bold text-gray-800">{product.name} ({product.color})</div> */}
                  <div className="text-sm font-bold text-gray-800">{product.name}</div>
                  <div className="text-sm text-gray-800">{product.brand}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Color */}
                  <div className="select-none flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg">
                    <div>Color: {product.color}</div>
                  </div>
                  
                  {/* Size */}
                  <div className="select-none flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg">
                    <div>Size: {product.size}</div>
                  </div>

                  {/* Quantity */}
                  <div className="select-none flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg">
                    <div>Quantity: {product.quantity}</div>
                  </div>
                </div>
                <div className="text-base font-bold text-gray-800">₹ {product.price}</div>

                {product?.stockSize <= 10 && <div className="text-sm font-bold text-green-600">Only {product?.stockSize} items left in stock</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsModal;
