import React, { useEffect, useState } from "react";

import WishlistService from "../../services/wishlist.service";

import useNotification from "../../custom-hooks/useNotification";

import Loading from "../Common/Loading/Loading";
import MoveToCartModal from "./MoveToCartModal/MoveToCartModal";
import WishlistedItemCard from "./WishlistedItemCard/WishlistedItemCard";

const Wishlist = () => {
  const showNotification = useNotification();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWishlistedItem, setSelectedWishlistedItem] = useState(null);

  const getWishlist = async () => {
    WishlistService.fetchAll()
      .then((res) => {
        if (res.status === 200) {
          setWishlistItems(res.data.data || []);
        } else {
          showNotification("error", "Couldn't fetch wishlist");
        }
      })
      .catch(() => {
        console.log(error);
        showNotification("error", "Couldn't fetch wishlist");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getWishlist();
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
      <div className="h-full p-8 overflow-auto bg-white custom-scrollbar">
        <h1 className="mb-6 text-2xl font-bold text-gray-600">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center text-gray-500">Wishlist is empty.</div>
        ) : (
          <div className="flex flex-wrap justify-center flex-1 gap-[40px] p-2 bg-white relative">
            {wishlistItems.map((item, index) => (
              <WishlistedItemCard key={index} wishlistedItem={item} getWishlist={getWishlist} setSelectedWishlistedItem={setSelectedWishlistedItem} />
            ))}
          </div>
        )}
      </div>

      {selectedWishlistedItem && <MoveToCartModal selectedWishlistedItem={selectedWishlistedItem} setSelectedWishlistedItem={setSelectedWishlistedItem} getWishlist={getWishlist} />}
    </div>
  );
};

export default Wishlist;
