import React, { useEffect } from "react";
import "./Login.scss";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const provider = new GoogleAuthProvider();

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    console.log("click!")
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    // ✅ ログイン状態を常に監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("isAuth", "true");
        setIsAuth(true);
        navigate("/"); // 確実に遷移！
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, [setIsAuth, navigate]);

  return (
    <div className="login">
      <div className="container">
        <img src="/images/recipeLogo.png" alt="" className="loginImg" />
        <div className="loginContainer">
          <button className="googleLoginBtn" onClick={loginWithGoogle}>
            <GoogleIcon className="googleIcon" />
            Googleでログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
