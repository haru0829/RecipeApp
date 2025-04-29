import React, { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./CreateRecipe.scss";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [people, setPeople] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [steps, setSteps] = useState([]);
  const [userData, setUserData] = useState(null); // 🔥追加

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 ユーザーデータを取得（名前とアイコン用）
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };
    fetchUserData();
  }, []);

  // ヘッダー画像アップロード
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `tempImages/${file.name}_${Date.now()}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    setImageUrl(downloadUrl);
  };

  // 投稿処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !userData) return; // 🔥 userData必須

    const newRecipe = {
      title,
      duration,
      people,
      description,
      image: imageUrl,
      steps,
      authorId: user.uid,
      authorName: userData.name, // 🔥追加
      authorImage: userData.profileImage, // 🔥追加
      createdAt: new Date(),
    };

    await addDoc(collection(db, "recipes"), newRecipe);
    navigate("/recipes");
  };
  // ステップのタイトルを変更
  const handleStepTitleChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].title = value;
    setSteps(updatedSteps);
  };

  // ステップ内にタスクを追加
  const handleAddTask = (index, taskText) => {
    if (taskText.trim() === "") return;
    const updatedSteps = [...steps];
    updatedSteps[index].tasks.push(taskText.trim());
    setSteps(updatedSteps);
  };

  // ステップ内のタスクを削除
  const handleDeleteTask = (stepIndex, taskIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].tasks.splice(taskIndex, 1);
    setSteps(updatedSteps);
  };

  // ステップの補足（ポイント）を変更
  const handlePointChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].point = value;
    setSteps(updatedSteps);
  };

  // ステップを削除
  const handleDeleteStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  // 新しいステップを追加
  const handleAddStep = () => {
    const newStep = {
      title: "",
      tasks: [],
      point: "",
    };
    setSteps([...steps, newStep]);
  };

  return (
    <>
      <header>
        <h1>投稿</h1>
      </header>
      <div className="create-recipe">
        {/* 画像アップロード */}
        <div
          className="header-image"
          onClick={() => fileInputRef.current.click()}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="レシピ画像" />
          ) : (
            <div className="placeholder">画像をアップロード</div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* 基本情報入力 */}
        <div className="content">
          <input
            className="create-recipe__input title-input"
            type="text"
            placeholder="レシピタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="meta-info">
            <input
              className="create-recipe__input"
              type="text"
              placeholder="期間（例: 3ヶ月）"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <textarea
            className="create-recipe__textarea"
            placeholder="レシピの説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* ステップ作成 */}
        <div className="steps">
          <h2>ステップ</h2>

          {steps.map((step, index) => (
            <div key={index} className="step-editor">
              <input
                className="create-recipe__input"
                type="text"
                placeholder="ステップタイトル"
                value={step.title}
                onChange={(e) => handleStepTitleChange(index, e.target.value)}
              />

              <div className="task-editor">
                <input
                  className="create-recipe__input"
                  type="text"
                  placeholder="タスクを追加"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              {/* タスクリスト */}
              <ul className="task-list">
                {step.tasks.map((task, i) => (
                  <li key={i} className="task-item">
                    {task}
                    <button
                      type="button"
                      className="delete-task-btn"
                      onClick={() => handleDeleteTask(index, i)}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>

              <textarea
                className="create-recipe__textarea"
                placeholder="補足・ポイント（任意）"
                value={step.point}
                onChange={(e) => handlePointChange(index, e.target.value)}
              />

              <button
                type="button"
                className="delete-step-btn"
                onClick={() => handleDeleteStep(index)}
              >
                ステップを削除
              </button>
            </div>
          ))}

          {/* ＋ステップ追加 */}
          <button
            type="button"
            className="add-step-btn"
            onClick={handleAddStep}
          >
            ＋ ステップを追加
          </button>
        </div>

        {/* 投稿ボタン */}
        <button className="startBtn" type="submit" onClick={handleSubmit}>
          投稿する
        </button>
      </div>
    </>
  );
};

export default CreateRecipe;
