import React, { useEffect, useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateRecipe.scss"; // CreateRecipeのスタイルを流用
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { onAuthStateChanged } from "firebase/auth";

const EditRecipe = () => {
  const { id } = useParams(); // URLパラメータからレシピID取得
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [steps, setSteps] = useState([]);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);

  //カテゴリ
  const categoryOptions = [
    "楽器",
    "語学",
    "運動・ボディメイク	",
    "プログラミング",
    "資格・学習",
    "ビジネススキル",
    "趣味・創作",
    "旅行・アウトドア",
    "ゲーム",
    "投資・お金",
    "習慣化チャレンジ",
    "生活スキル・家事",
    "美容・セルフケア",
  ];

  // レシピの初期データ取得
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDuration(data.duration || "");
          setDescription(data.description || "");
          setImageUrl(data.image || "");
          setSteps(data.steps || []);
          setCategory(data.category || "");
          setTags(data.tag || []);
        }
      } catch (error) {
        console.error("レシピ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  // 画像変更
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `tempImages/${file.name}_${Date.now()}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    setImageUrl(downloadUrl);
  };

  // ステップ編集関連
  const handleStepTitleChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].title = value;
    setSteps(updatedSteps);
  };

  const handleAddTask = (index, taskText) => {
    if (taskText.trim() === "") return;
    const updatedSteps = [...steps];
    updatedSteps[index].tasks.push(taskText.trim());
    setSteps(updatedSteps);
  };

  const handleDeleteTask = (stepIndex, taskIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].tasks.splice(taskIndex, 1);
    setSteps(updatedSteps);
  };

  const handlePointChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].point = value;
    setSteps(updatedSteps);
  };

  const handleAddStep = () => {
    const newStep = { title: "", tasks: [], point: "" };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  // レシピ更新処理
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !duration.trim() ||
      !description.trim() ||
      !category.trim() ||
      steps.length === 0
    ) {
      alert(
        "すべての必須項目（タイトル・期間・説明・カテゴリ・ステップ）を入力してください。"
      );
      return;
    }

    const emptyStepIndex = steps.findIndex(
      (step) => !step.title.trim() || step.tasks.length === 0
    );
    if (emptyStepIndex !== -1) {
      alert(
        `ステップ ${emptyStepIndex + 1} にタイトルまたはタスクがありません。`
      );
      return;
    }

    const recipeRef = doc(db, "recipes", id);
    await updateDoc(recipeRef, {
      title,
      duration,
      description,
      image: imageUrl,
      steps,
      category,
      tag: tags,
    });

    alert("レシピを更新しました！");
    navigate("/recipes");
  };

  if (loading) return <div>読み込み中...</div>;

  const handleBack = () => {
    navigate(-1); // ← ブラウザ履歴で一つ前に戻る
  };

  return (
    <>
      <header>
        <ArrowBackIosNewIcon className="back-btn" onClick={handleBack} />
        <h1>編集</h1>
      </header>
      <div className="create-recipe">
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

          {/* カテゴリ選択 */}
          <div className="categorySelector">
            <p className="sectionTitle">カテゴリ</p>
            <div className="categoryOptions">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  className={`categoryChip ${
                    category === cat ? "selected" : ""
                  }`}
                  onClick={() => setCategory(cat)}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* タグ入力 */}
          <div className="tagInputWrapper">
            <label>タグ（自由入力・Enterで追加）</label>
            <input
              type="text"
              placeholder="例: 習慣化"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim() !== "") {
                  e.preventDefault();
                  if (!tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                  }
                  setTagInput("");
                }
              }}
            />
            <div className="tagList">
              {tags.map((tag, index) => (
                <span className="tagChip" key={index}>
                  #{tag}
                  <button
                    className="deleteTag"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

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

          <button
            type="button"
            className="add-step-btn"
            onClick={handleAddStep}
          >
            ＋ ステップを追加
          </button>
        </div>

        <button className="startBtn" type="submit" onClick={handleUpdate}>
          更新する
        </button>
      </div>
    </>
  );
};

export default EditRecipe;
