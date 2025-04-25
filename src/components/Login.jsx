import React from "react";
import "./Login.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom"; // ← 追加

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate(); // ← 追加

  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);
      navigate("/"); // ← ログイン成功後にホームへ遷移！
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
