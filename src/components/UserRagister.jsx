import React, { useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./UserRegister.scss";

const UserRegistration = () => {
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 🔥 追加

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 入力中にリアルタイムバリデーション
  const handleAccountIdChange = (e) => {
    const value = e.target.value;
    setAccountId(value);

    if (!isValidAccountId(value)) {
      setErrorMessage("アカウントIDは半角英数字と_のみ、3〜20文字で入力してください。");
    } else {
      setErrorMessage(""); // 正常ならエラー消す
    }
  };

  // アカウントIDの文字列チェック
  const isValidAccountId = (id) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(id) && id.length >= 3 && id.length <= 20;
  };

  const isFormValid = name.trim() !== "" && isValidAccountId(accountId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 毎回リセット

    if (!isValidAccountId(accountId)) {
      setErrorMessage("アカウントIDは半角英数字と_のみ、3〜20文字で入力してください。");
      return;
    }

    // 重複チェック
    const q = query(collection(db, "users"), where("accountId", "==", accountId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setErrorMessage("このアカウントIDは既に使用されています。");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    let profileImageUrl = "";

    if (imageFile) {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, imageFile);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name,
      accountId,
      bio: "",
      career: [],
      genres: [],
      profileImage: profileImageUrl,
      rating: 4.7,
      successCount: 0,
    });

    navigate("/");
  };

  return (
    <div className="user-registration">
      <header>
        <h1 className="user-registration__title">ユーザー登録</h1>
      </header>

      <div className="user-registrationContainer">
        <div className="user-registration__avatar" onClick={handleImageClick}>
          <img
            src={
              previewUrl ||
              "https://knsoza1.com/wp-content/uploads/2020/07/70b3dd52350bf605f1bb4078ef79c9b9.png"
            }
            alt="プロフィールアイコン"
            className="user-registration__avatar-image"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <form className="user-registration__form" onSubmit={handleSubmit}>
          <input
            className="user-registration__input"
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="user-registration__input"
            type="text"
            placeholder="アカウントID（@なし）"
            value={accountId}
            onChange={handleAccountIdChange} // ⭐️ 入力時チェック
            required
          />

          {/* エラーメッセージ表示 */}
          {errorMessage && (
            <div className="user-registration__error">
              {errorMessage}
            </div>
          )}

          <button
            className="user-registration__submit"
            type="submit"
            disabled={!isFormValid}
          >
            登録して始める
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
