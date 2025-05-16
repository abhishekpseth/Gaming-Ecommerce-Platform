import React, { useEffect, useRef } from "react";

import userUtils from "../../../Utils/User/User.util";

const Carousel = ({ images, hover, setCarouselIndex, wishListBoxHeight }) => {
  const slidesWrapper = useRef(null);
  const intervalRef = useRef(null);

  const len = images.length;

  const moveSlides = (offset) => {
    const wrapper = slidesWrapper.current;
    for (let index = 0; index < wrapper.children.length; index++) {
      wrapper.children[index].style.left = `${(index + offset) * 100}%`;
    }
  };

  const slideRight = () => {
    const wrapper = slidesWrapper.current;

    setCarouselIndex((prev) => {
      const newCounter = prev > len - 2 ? 0 : prev + 1;

      moveSlides(-2);
      wrapper.removeChild(wrapper.firstElementChild);
      const firstClone = wrapper.children[0].cloneNode(true);
      wrapper.appendChild(firstClone);
      firstClone.style.left = `${(len - 1) * 100}%`;
      return newCounter;
    });
  };

  const startAutoSlide = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(slideRight, 1000);
    }
  };

  const stopAutoSlideAndReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    resetCarousel();
  };

  const resetCarousel = () => {
    const wrapper = slidesWrapper.current;
    wrapper.innerHTML = "";

    images.forEach((imgLink, index) => {
      const el = document.createElement("img");
      el.src = imgLink;
      el.className = "absolute w-full h-full transition-all duration-700";
      el.style.left = `${index * 100}%`;
      wrapper.appendChild(el);
    });

    const lastClone = wrapper.children[len - 1].cloneNode(true);
    wrapper.insertBefore(lastClone, wrapper.children[0]);
    lastClone.style.left = "-100%";

    setCarouselIndex(0);
  };

  useEffect(() => {
    if (hover) {
      startAutoSlide();
    } else {
      stopAutoSlideAndReset();
    }
  }, [hover]);

  useEffect(() => {
    resetCarousel();
  }, []);

  return (
    <div className="flex justify-center w-full h-full bg-white">
      <div
        ref={slidesWrapper}
        className="relative w-full transition-all duration-1000"
        style={{
          height: hover ? userUtils.isLoggedIn() ? `calc(100% - ${wishListBoxHeight - 10}px)` : "calc(100% - 20px)" : "100%",
        }}
      ></div>
    </div>
  );
};

export default Carousel;
