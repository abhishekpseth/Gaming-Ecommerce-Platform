import { useGoogleLogin } from "@react-oauth/google";
import React from "react";
import { MdLogin } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  const responseGoogle = (authResult) => {
    if (authResult["code"]) {
      LoginService.login(authResult.code)
        .then((res) => {
          if (res.status === 200) {
            const { email, name } = res.data.user;
            const imageSrc = res.data.profileImgURL;
            const token = res.data.token;
            const obj = { email, name, token, imageSrc };
            localStorage.setItem("user-info", JSON.stringify(obj));
            showNotification("success", "Logged In successfully");
            console.log("hello", india);
            navigate("/rider-dashboard");
          } else {
            showNotification("error", "Couldn't Log In");
          }
        })
        .catch((error) => {
          console.log(error);
          showNotification("error");
        });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      <div
        onClick={googleLogin}
        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-pink-600 border border-gray-200 cursor-pointer w-max hover:border-pink-600"
      >
        <MdLogin className="text-lg" />
        LOGIN/SIGNUP
      </div>
    </div>
  );
};

export default Home;
