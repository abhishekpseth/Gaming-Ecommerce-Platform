import React, { useState } from "react";

import { MdCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

import WishlistService from "../../../services/wishlist.service";

import useNotification from "../../../custom-hooks/useNotification";

const WishlistedItemCard = ({ wishlistedItem, getWishlist, setSelectedWishlistedItem }) => {
  const showNotification = useNotification();
  
  const handleCardClick = () => {
    const url = `/products?productID=${wishlistedItem?.productID}&variantID=${wishlistedItem?.variantID}`;
    window.open(url, '_blank');
  };

  const removeFromWishList = () => {
    WishlistService.removeFromWishlist(wishlistedItem?.productID, wishlistedItem?.variantID)
      .then((res) => {
        if (res.status === 200) {
          showNotification("success", res.data.message);
          getWishlist();
        } else {
          showNotification("error", "Couldn't remove from wishlist");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };

  return (
    <div
      className="h-[300px] w-[200px] lg:h-[400px] lg:w-[250px] flex flex-col cursor-pointer border border-gray-200 overflow-hidden"
      onClick={handleCardClick}
      onContextMenu={(e) => e.preventDefault()}
      title={`${wishlistedItem.brand} ${wishlistedItem.name}`}
    >
      <div className="relative flex justify-center flex-1 overflow-hidden">
        <img className="max-h-full" src={wishlistedItem.imageSrc[0]} />
        <div 
          className="absolute px-1 py-1 border border-gray-400 rounded-full cursor-pointer bg-neutral-50 right-2 top-2"
          title="Remove from wishlist"
        >
          <RxCross2
            onClick={(e) => {
              e.stopPropagation();
              removeFromWishList();
            }}
            className="w-3 h-3 text-gray-800"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 py-2">
        {/* Brand */}
        <div
          className="text-lg font-semibold"
          style={{
            whiteSpace: "wrap",
            textOverflow: "ellipsis",
          }}
        >
          {wishlistedItem.brand}
        </div>

        {/* Product Name */}
        <div
          className="text-[16px] text-gray-600"
          style={{
            whiteSpace: "wrap",
            textOverflow: "ellipsis",
          }}
        >
          {wishlistedItem.name}
        </div>

        {/* Price */}
        <div className="text-[16px] font-semibold">
          Rs. {wishlistedItem.price}
        </div>
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedWishlistedItem(wishlistedItem);
        }}
        className="flex items-center justify-center py-3 text-sm font-bold text-pink-600 border border-l-0 border-r-0 border-gray-200"
      >
        ADD TO CART
      </div>
    </div>
  );
};

export default WishlistedItemCard;
