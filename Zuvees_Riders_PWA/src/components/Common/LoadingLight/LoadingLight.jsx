import React from "react";

import styles from "./LoadingLight.module.css";

const LoadingLight = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "40%",
        height: "100%",
        width: "100%",
      }}
    >
      <div className={styles.Loading}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingLight;
