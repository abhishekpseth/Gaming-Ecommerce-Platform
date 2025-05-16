import React, { useEffect, useRef, useState } from "react";

import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { TbActivityHeartbeat } from "react-icons/tb";

import WishlistService from "../../../services/wishlist.service";

import useNotification from "../../../custom-hooks/useNotification";

import userUtils from "../../../Utils/User/User.util";
import Carousel from "../../Common/Carousel/Carousel";

const ProductCard = ({ product, handleWishlistItem }) => {
  const showNotification = useNotification();
  const [isHoveringOnCard, setIsHoveringOnCard] = useState(false);
  const [isHoveringOnWishlistBtn, setIsHoveringOnWishlistBtn] = useState(false);
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);
  const [wishListBoxHeight, setWishListBoxHeight] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleCardClick = () => {
    const url = `/products?productID=${product?.productID}&variantID=${product?.variantID}`;
    window.open(url, "_blank");
  };

  const addToWishlist = () => {
    setAddToWishlistLoading(true);
    WishlistService.addToWishlist(product?.productID, product?.variantID)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          showNotification("success", res.data.message);
          handleWishlistItem(product?._id);
        } else {
          showNotification("error", "Couldn't add to wishlist");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      })
      .finally(() => {
        setAddToWishlistLoading(false);
      });
  };

  const wishlistBoxRef = useRef(null);

  useEffect(() => {
    if (wishlistBoxRef.current) {
      setWishListBoxHeight(wishlistBoxRef.current.offsetHeight);
    }
  }, []);

  return (
    <div
      className="pb-2 xl:h-[380px] lg:h-[300px] h-[300px] xs:h-[250px] lg:w-[200px] xl:w-[250px] md:w-[200px] w-[calc(100%-20px)] xs:w-[150px] flex flex-col cursor-pointer border border-gray-200"
      onMouseEnter={() => setIsHoveringOnCard(true)}
      onMouseLeave={() => setIsHoveringOnCard(false)}
      onClick={handleCardClick}
      onContextMenu={(e) => e.preventDefault()}
      title={`${product.brand} ${product.name}`}
    >
      <div className="relative flex-1 w-full overflow-hidden">
        <Carousel
          images={product.imageSrc || ""}
          hover={isHoveringOnCard}
          setCarouselIndex={setCarouselIndex}
          wishListBoxHeight={wishListBoxHeight}
        />

        {/* Wishlist Box */}
        <div
          ref={wishlistBoxRef}
          className="absolute z-10 flex flex-col w-full gap-2 p-2 transition-transform duration-300 bg-white"
          onMouseEnter={() => setIsHoveringOnWishlistBtn(true)}
          onMouseLeave={() => setIsHoveringOnWishlistBtn(false)}
          style={{
            transform: isHoveringOnCard
              ? userUtils.isLoggedIn()
                ? `translateY(-${wishListBoxHeight - 5}px)`
                : "translateY(-20px)"
              : "translateY(0)",
          }}
        >
          <div className="flex justify-center w-full gap-2">
            {product?.imageSrc &&
              Array.isArray(product.imageSrc) &&
              product.imageSrc.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === carouselIndex ? "bg-pink-600" : "bg-gray-400"
                  }`}
                >
                  &nbsp;
                </div>
              ))}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist();
            }}
            className="flex items-center justify-center py-1 border rounded-xl text-md"
            style={{
              borderColor: isHoveringOnWishlistBtn
                ? "oklch(59.2% 0.249 0.584)"
                : "oklch(70.7% 0.022 261.325)",
            }}
          >
            <div className="flex items-center gap-2">
              {addToWishlistLoading ? (
                <TbActivityHeartbeat className="text-2xl text-pink-600" />
              ) : product?.isWishlisted === true ? (
                <FaHeart className="text-base text-pink-600" />
              ) : (
                <CiHeart className="text-xl" />
              )}
              <div className="text-gray-700">Wishlist</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Brand */}
        {!isHoveringOnCard && (
          <div
            className="w-full text-lg font-semibold text-center"
            style={{
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
            }}
          >
            {product.brand}
          </div>
        )}

        {/* Product Name */}
        <div
          className="text-[16px] text-gray-600 w-full text-center"
          style={{
            whiteSpace: "wrap",
            textOverflow: "ellipsis",
          }}
        >
          {isHoveringOnCard
            ? `Sizes: ${product.availableSizes.join(", ")}`
            : product.name}
        </div>

        {/* Price */}
        <div className="pt-2 text-[16px] font-semibold text-gray-500 w-full text-center">
          Rs. {product.price}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
