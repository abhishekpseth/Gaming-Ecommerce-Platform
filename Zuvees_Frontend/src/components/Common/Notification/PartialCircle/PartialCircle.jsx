import React, { useEffect, useRef } from "react";

const PartialCircle = ({
  percentage,
  radius = 15,
  strokeWidth = 2,
  children,
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const circumference = 2 * Math.PI * radius;

  const arcLength = (clampedPercentage / 100) * circumference;

  const size = radius * 2 + strokeWidth;

  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (circle) {
      circle.style.transition = "stroke-dasharray 0.5s ease-in-out";
      circle.style.strokeDasharray = `${arcLength} ${circumference}`;
    }
  }, [arcLength, circumference]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="transparent"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          ref={circleRef}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          color: "white",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PartialCircle;
