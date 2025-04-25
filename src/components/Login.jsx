import React from "react";
import "./Login.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom"; // ← 追加
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


const Login = ({ setIsAuth }) => {
  const navigate = useNavigate(); // ← 追加

  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        localStorage.setItem("isAuth", "true");
        setIsAuth(true);
    
        // ユーザー情報保存
        createUserDoc(result.user);
    
        // 遷移
        navigate("/");
    });
  };

  const createUserDoc = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
  
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        selectedRecipeId: "",
        progress: {},
        createdAt: new Date(),
      });
      console.log("✅ Firestoreにユーザーデータ保存完了");
    } else {
      console.log("ℹ️ ユーザー情報はすでに存在");
    }
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
