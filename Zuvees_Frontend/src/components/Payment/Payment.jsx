import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartService from "../../services/cart.service";
import OrderService from "../../services/order.service";

import useNotification from "../../custom-hooks/useNotification";

import { setCartSize } from "../../../slices/cartSlice";

import Loading from "../Common/Loading/Loading";
import LoadingLight from "../Common/LoadingLight/LoadingLight";
import PriceSummationPayment from "./PriceSummation/PriceSummationPayment";
import PaymentMethodsItemParent from "./PaymentMethodsItemParent/PaymentMethodsItemParent";

const Payment = () => {
  const navigate = useNavigate();
  
  const showNotification = useNotification();

  const dispatch = useDispatch();

  const { addressObject } = useSelector((state) => state.userSlice);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const getCart = async () => {
    setLoading(true);
    CartService.fetchCartItems()
      .then((res) => {
        if (res.status === 200) {
          const itemsWithQuantity = res.data.cartItems.map((item) => ({
            ...item,
            quantity: item.quantity || 1,
          }));
          setCartItems(itemsWithQuantity);
        } else {
          showNotification("error", "Couldn't fetch Cart");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error", "Couldn't fetch Cart");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCartSizeForUser = () => {
    CartService.cartSize()
      .then((res) => {
        if(res.status === 200){
          dispatch(setCartSize(res?.data?.cartSize || 0));
        }else{
          showNotification("error", "Couldn't fetch cart size"); 
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };
   
  const calculateSubtotal = (item) => item.price * item.quantity;

  const totalMRP = Number(cartItems.reduce((acc, item) => acc + calculateSubtotal(item), 0)).toFixed(2);
  const platformFee = 20;
  const codFee = 10;

  const handleCheckout = () => {
    if(!addressObject){
      showNotification("error", "Address is required");
      return;
    }
    
    const addressText = `${addressObject?.name}, ${addressObject?.address}, ${addressObject?.locality}, ${addressObject?.district}, ${addressObject?.state} - ${addressObject?.pinCode}, Mobile- ${addressObject?.mobileNumber}`;
    
    if (!addressText.trim()) {
      showNotification("error", "Address is required");
      return;
    }

    if(!selectedPaymentMethod){
      showNotification("error", "Payment method is required");
      return;
    }

    const paymentMethod = (selectedPaymentMethod === "cod") ? "COD" : (selectedPaymentMethod === "onlineqr") ? "UPI" : "Other";
    
    let totalAmount  = Number(totalMRP) + Number(platformFee) + (selectedPaymentMethod === "cod" ? Number(codFee) : 0);
    totalAmount = totalAmount.toFixed(2);

    const products = cartItems.map((cartItem) => {
      return {
        productID: cartItem.productID,
        variantID: cartItem.variantID,
        name: cartItem.productName,
        brand: cartItem.brand,
        color: cartItem.color,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: cartItem.price,
        images: cartItem.images,
      }
    });

    setOrderLoading(true);
    OrderService.createOrder(products, addressText, paymentMethod, totalAmount)
      .then((res) => {
        if (res.status === 201) {
          showNotification("success", "Ordered Successfully");
          getCartSizeForUser();
          navigate("/");
        } else {
          showNotification("error", "Couldn't order");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(() => {
        setOrderLoading(false);
      });
  };

  useEffect(() => {
    getCart();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full p-2 overflow-auto bg-white sm:p-8 custom-scrollbar">
        <h1 className="mb-6 text-2xl font-bold text-gray-600">Checkout</h1>

        <div className="flex flex-col justify-center w-full gap-5 overflow-hidden sm:flex-row sm:h-full">
          <div className="h-full bg-white w-full sm:w-[500px] flex flex-col gap-5">
            {/* Address */}
            <div className="flex flex-col items-center justify-between px-3 py-2 bg-gray-100 border border-gray-200 select-none sm:flex-row rounded-xl opacity-60">
              {addressObject === null ? (
                <div className="font-bold">No address available.</div>
              ) : (
                <div className="flex flex-col w-full gap-1 overflow-auto">
                  <div className="font-bold text-nowrap">Deliver to:</div>
                  <div className="text-sm break-words sm:text-base">{`${addressObject?.name}, ${addressObject?.address}, ${addressObject?.locality}, ${addressObject?.district}, ${addressObject?.state} - ${addressObject?.pinCode}`}</div>
                  <div className="flex gap-2 text-sm break-words sm:text-base">
                    <div className="font-bold">Mobile- </div>
                    <div>{addressObject?.mobileNumber}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              {/* Pay On Delivery */}
              <PaymentMethodsItemParent selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} id="cod">
                <div className="flex flex-col items-center justify-center w-full gap-2">
                  <div className="w-full h-full text-sm font-bold">Pay On Delivery (CASH / UPI)</div>
                  {selectedPaymentMethod === "cod" && (
                    <div className="flex flex-col w-full gap-3">
                      <div className="text-xs text-gray-700">For this option, there is a fee of ₹ 10, You can pay online to avoid this.</div>

                      <div className="p-2">
                        <button onClick={handleCheckout} className="flex items-center justify-center w-full gap-2 p-2 text-sm font-bold text-white bg-pink-600 rounded-md">
                          {orderLoading && (
                            <div className="relative w-4 h-4">
                              <LoadingLight />
                            </div>
                          )}
                          PLACE ORDER
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </PaymentMethodsItemParent>

              {/* Online QR*/}
              <PaymentMethodsItemParent selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} id="onlineqr">
                <div className="flex flex-col items-center justify-center w-full gap-2">
                  <div className="w-full h-full text-sm font-bold">UPI (Pay via any App)</div>
                  {selectedPaymentMethod === "onlineqr" && (
                    <div className="flex flex-col w-full gap-3">
                      <div className="p-2">
                        <button onClick={handleCheckout} className="flex items-center justify-center w-full gap-2 p-2 text-sm font-bold text-white bg-pink-600 rounded-md">
                          {orderLoading && (
                            <div className="relative w-4 h-4">
                              <LoadingLight />
                            </div>
                          )}
                          PLACE ORDER
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </PaymentMethodsItemParent>
            </div>
          </div>

          <div className="h-[1px] w-full sm:h-full sm:w-[1px] bg-gray-200">&nbsp;</div>

          {/* Price Summation */}
          <PriceSummationPayment totalMRP={totalMRP} platformFee={platformFee} selectedPaymentMethod={selectedPaymentMethod} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
