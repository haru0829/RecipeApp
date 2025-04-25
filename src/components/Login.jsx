import React from "react";
import "./Login.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import GoogleIcon from "@mui/icons-material/Google"; // MUIアイコン（任意）

const Login = ({ setIsAuth }) => {
  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
    });
  };
  return (
    <div className="login">
      <div className="container">
        <img src="/images/recipeLogo.png" alt="" className="loginImg" />
        <div className="loginContainer">
          <button className="googleLoginBtn" onClick={loginInWithGoogle}>
            <GoogleIcon className="googleIcon" />
            Googleでログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
