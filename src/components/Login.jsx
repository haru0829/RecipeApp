import React from "react";
import "./Login.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = ({ setIsAuth }) => {
  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
    });
  };
  return (
    <div className="login">
      <div className="loginContainer">
        <img src="/images/recipeLogo.png" alt="" className="loginImg"/>
        <button className="loginBtn" onClick={loginInWithGoogle}>Googleでログイン</button>
      </div>
    </div>
  );
};

export default Login;
