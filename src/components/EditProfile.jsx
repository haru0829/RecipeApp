import React, { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./EditProfile.scss";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [careerText, setCareerText] = useState("");
  const [genresText, setGenresText] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setAccountId(data.accountId || "");
        setCareerText(data.career?.join(",") || "");
        setGenresText(data.genres?.join(",") || "");
        setBio(data.bio || "");
        setPreviewUrl(data.profileImage || "");
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const isValidAccountId = (id) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(id) && id.length >= 3 && id.length <= 20;
  };

  const handleAccountIdChange = (e) => {
    const value = e.target.value;
    setAccountId(value);
    if (!isValidAccountId(value)) {
      setErrorMessage(
        "アカウントIDは半角英数字と_のみ、3〜20文字で入力してください。"
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    let profileImageUrl = previewUrl;

    if (imageFile) {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, imageFile);
      profileImageUrl = await getDownloadURL(imageRef);
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        name,
        accountId,
        career: careerText.split(",").map((c) => c.trim()),
        genres: genresText.split(",").map((g) => g.trim()),
        bio,
        profileImage: profileImageUrl,
      },
      { merge: true }
    );

    navigate("/profile/1");
  };

  return (
    <div className="edit-profile">
      <header>
        <h1 className="edit-profile__title">プロフィール編集</h1>
      </header>

      <div className="edit-profileContainer">
        <div
          className="edit-profile__avatar"
          onClick={() => fileInputRef.current.click()}
        >
          <img
            src={
              previewUrl ||
              "https://knsoza1.com/wp-content/uploads/2020/07/70b3dd52350bf605f1bb4078ef79c9b9.png"
            }
            alt="プロフィール画像"
            className="edit-profile__avatar-image"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <form className="edit-profile__form" onSubmit={handleSubmit}>
          <input
            className="edit-profile__input"
            type="text"
            placeholder="ニックネーム"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="edit-profile__input"
            type="text"
            placeholder="ユーザーネーム"
            value={accountId}
            onChange={handleAccountIdChange}
          />

          <input
            className="edit-profile__input"
            type="text"
            placeholder="経歴・実績（カンマ区切り）"
            value={careerText}
            onChange={(e) => setCareerText(e.target.value)}
          />

          <input
            className="edit-profile__input"
            type="text"
            placeholder="得意ジャンル（カンマ区切り）"
            value={genresText}
            onChange={(e) => setGenresText(e.target.value)}
          />

          <textarea
            className="edit-profile__textarea"
            placeholder="自己紹介"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          {errorMessage && (
            <div className="edit-profile__error">{errorMessage}</div>
          )}

          <button className="edit-profile__submit" type="submit">
            決定
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
