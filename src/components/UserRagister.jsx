import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [bio, setBio] = useState("");
  const [careerText, setCareerText] = useState(""); // 🔥
  const [genresText, setGenresText] = useState(""); // 🔥
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("auth.currentUser:", auth.currentUser);
    console.log("auth token:", await auth.currentUser?.getIdToken());

    e.preventDefault();
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
      bio,
      career: careerText.split(",").map((c) => c.trim()), // 🔥
      genres: genresText.split(",").map((g) => g.trim()), // 🔥
      profileImage: profileImageUrl,
      rating: 4.7,
      successCount: 0,
    });

    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ユーザー登録</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="アカウントID（@なし）"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />
        <textarea
          placeholder="自己紹介"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="text"
          placeholder="経歴・実績（カンマ区切り）"
          value={careerText}
          onChange={(e) => setCareerText(e.target.value)}
        />
        <input
          type="text"
          placeholder="得意ジャンル（カンマ区切り）"
          value={genresText}
          onChange={(e) => setGenresText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit">登録して始める</button>
      </form>
    </div>
  );
};

export default UserRegistration;
