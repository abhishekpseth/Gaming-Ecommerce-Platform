import React from "react";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-3">
      <img src="https://uat-futurelectra-public.s3.ap-south-1.amazonaws.com/FEAgentDashboard/Loading.gif" style={{ height: "40px", width: "40px" }} />
      <div className="text-lg">Loading..</div>
    </div>
  );
};

export default Loading;
