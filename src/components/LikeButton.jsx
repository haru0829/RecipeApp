import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase"; // firebase 初期化済みの db を import
import "./LikeButton.scss";
import { auth } from "../firebase";


const LikeButton = ({
  recipeId,
  userId,
  initialLiked = false,
  initialCount = 0,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  useEffect(() => {
    if (!userId) return;
    const likeRef = doc(db, "recipes", recipeId, "likes", userId);
    getDoc(likeRef).then((snap) => {
      setLiked(snap.exists());
    });

    const recipeRef = doc(db, "recipes", recipeId);
    getDoc(recipeRef).then((snap) => {
      if (snap.exists()) {
        setLikeCount(snap.data().likeCount || 0);
      }
    });
  }, [recipeId, userId]);

  const toggleLike = async () => {
    console.log("auth.currentUser?.uid:", auth.currentUser?.uid);
    console.log("userId:", userId);

    if (!userId) {
      alert("ログインしてください");
      return;
    }

    const recipeRef = doc(db, "recipes", recipeId);
    const likeRef = doc(db, "recipes", recipeId, "likes", userId);

    if (liked) {
      await deleteDoc(likeRef);
      await updateDoc(recipeRef, {
        likeCount: increment(-1),
      });
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      await setDoc(likeRef, { liked: true }, { merge: true });
      await updateDoc(recipeRef, {
        likeCount: increment(1),
      });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <button onClick={toggleLike} className="likeButton">
      {liked ? "♥" : "♡"} {likeCount}
    </button>
  );
};

export default LikeButton;
