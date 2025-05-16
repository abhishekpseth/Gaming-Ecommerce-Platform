import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RxCross1 } from "react-icons/rx";
import { BiSolidDownArrow } from "react-icons/bi";

import UserService from "../../services/user.service";
import CartService from "../../services/cart.service";

import { setCartSize } from "../../../slices/cartSlice";
import { setAddressObject } from "../../../slices/userSlice";

import useNotification from "../../custom-hooks/useNotification";

import Loading from "../Common/Loading/Loading";
import AddressModal from "./AddressModal/AddressModal";
import PriceSummation from "./PriceSummation/PriceSummation";
import SelectSizeModal from "./SelectSizeModal/SelectSizeModal";
import SelectQuantityModal from "./SelectQuantityModal/SelectQuantityModal";

const Cart = () => {
  const showNotification = useNotification();
  
  const { addressObject } = useSelector((state) => state.userSlice);
  
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [isSelectSizeModalOpen, setIsSelectSizeModalOpen] = useState(false);
  const [isSelectQuantityModalOpen, setIsSelectQuantityModalOpen] = useState(false);

  const handleCardClick = (productID, variantID) => {
    const url = `/products?productID=${productID}&variantID=${variantID}`;
    window.open(url, "_blank");
  };

  const getCart = async () => {
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

  const calculateSubtotal = (item) => item.price * item.quantity;

  const totalMRP = Number(cartItems.reduce((acc, item) => acc + calculateSubtotal(item), 0)).toFixed(2);
  const platformFee = 20;

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
  
  
  const handleRemoveCartItem = (cartID, quantity) => {
    CartService.deleteCartItem(cartID)
      .then((res) => {
        if (res.status === 200) {
          showNotification("success", "Cart Item removed successfully");
          getCartSizeForUser();
          getCart();
        } else {
          showNotification("error", "Couldn't remove cart item");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };

  const fetchAllAddresses = () => {
    UserService.fetchAllAddresses()
      .then((res) => {
        if (res.status === 200) {
          setAddresses(res?.data?.addresses || []);
        } else {
          showNotification("error", "Couldn't fetch Addresses");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCart();
    fetchAllAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const addressObject = addresses.find((address) => address?._id == selectedAddress);
      dispatch(setAddressObject(addressObject));
    }
  }, [selectedAddress]);

  if (loading) {
    return (
      <div className="relative w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="h-full p-2 overflow-auto sm:p-8 custom-scrollbar">
        <h1 className="mb-6 text-2xl font-bold text-gray-600">My Cart</h1>

        <div className="flex flex-col justify-center w-full gap-5 overflow-hidden sm:h-full sm:flex-row">
          {/* Cart Item Details */}
          <div className="h-full bg-white w-full sm:w-[500px] flex flex-col">
            {/* Address */}
            <div className="flex flex-col items-center justify-between px-3 py-6 bg-gray-100 border border-gray-200 sm:flex-row">
              {addressObject === null && selectedAddress === null ? (
                <div className="font-bold">No address available</div>
              ) : (
                <div className="flex gap-1">
                  <div>Deliver to:</div>
                  <div className="font-bold">{`${addressObject?.name}, ${addressObject?.pinCode}`}</div>
                </div>
              )}
              <div onClick={() => setIsAddressModalOpen(true)} className="px-3 py-2 text-sm font-bold text-pink-600 border border-pink-600 rounded-md cursor-pointer">
                {addresses.length === 0 ? "Add Address" : selectedAddress === null ? "Select Address" : "Change Address"}
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="py-4">
              {cartItems.map((item) => (
                <div
                  key={item?.cartID}
                  onClick={() => handleCardClick(item?.productID, item?.variantID)}
                  className="cursor-pointer relative mb-2 flex p-2 border border-gray-200 min-h-[160px] hover:border-pink-600"
                >
                  <div>
                    <img src={item.images[0]} className="h-full max-w-32" />
                  </div>
                  <div className="flex flex-col gap-3 p-2 px-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-gray-800">{item.productName} ({item.color})</div>
                      <div className="text-sm text-gray-800">{item.brand}</div>
                    </div>

                    <div className="flex flex-wrap items-start gap-2">
                      {/* Color */}
                      <div
                        className="cursor-pointer flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg"
                      >
                        <div>Size: {item.color}</div>
                        {/* <BiSolidDownArrow className="text-[8px]" /> */}
                      </div>
                      
                      {/* Size */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCartItem(item);
                          setIsSelectSizeModalOpen(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg"
                      >
                        <div>Size: {item.size}</div>
                        <BiSolidDownArrow className="text-[8px]" />
                      </div>

                      {/* Quantity */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCartItem(item);
                          setIsSelectQuantityModalOpen(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 px-1 py-1 text-[13px] font-bold bg-gray-200 rounded-lg"
                      >
                        <div>Quantity: {item.quantity}</div>
                        <BiSolidDownArrow className="text-[8px]" />
                      </div>
                    </div>
                    <div className="text-base font-bold text-gray-800">₹ {item.price}</div>

                    {item?.stockSize <= 10 && <div className="text-sm font-bold text-green-600">Only {item?.stockSize} items left in stock</div>}
                  </div>
                  <div className="absolute top-3 right-3">
                    <RxCross1
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCartItem(item?.cartID, item?.quantity);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="h-[1px] w-full sm:h-full sm:w-[1px] bg-gray-200">&nbsp;</div>

          {/* Price Summation */}
          <PriceSummation totalMRP={totalMRP} platformFee={platformFee} />
        </div>
      </div>

      {isAddressModalOpen && (
        <AddressModal
          addresses={addresses}
          fetchAllAddresses={fetchAllAddresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          setIsAddressModalOpen={setIsAddressModalOpen}
        />
      )}

      {isSelectSizeModalOpen && <SelectSizeModal selectedCartItem={selectedCartItem} setSelectedCartItem={setSelectedCartItem} setIsSelectSizeModalOpen={setIsSelectSizeModalOpen} getCart={getCart} />}

      {isSelectQuantityModalOpen && (
        <SelectQuantityModal selectedCartItem={selectedCartItem} setSelectedCartItem={setSelectedCartItem} setIsSelectQuantityModalOpen={setIsSelectQuantityModalOpen} getCart={getCart} />
      )}
    </div>
  );
};

export default Cart;
