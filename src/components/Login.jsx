import React from "react";
import "./Login.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const loginInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setIsAuth(true);
      localStorage.setItem("isAuth", "true");

      // 🔥 Firestoreにそのユーザーのデータが存在するかチェック
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // 登録済みならホームへ
        navigate("/");
      } else {
        // 未登録ならRegisterページへ
        navigate("/register");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <img src="/images/recipeLogo.png" alt="logo" className="loginImg" />
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
