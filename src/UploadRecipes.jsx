// // src/UploadRecipes.jsx

// import { db } from "./firebase";
// import { collection, setDoc, doc } from "firebase/firestore";
// import { recipes } from "./data/RecipeData"; // 必ずidを含まないようにする
// import { serverTimestamp } from "firebase/firestore";

// const uploadAllRecipes = async () => {
//   const recipeCollection = collection(db, "recipes");

//   for (const original of recipes) {
//     const ref = doc(recipeCollection); // Firestore に新しいドキュメントを作成（ID自動生成）
//     const newId = ref.id;

//     const recipe = {
//       ...original,
//       id: newId, // 自動生成IDをレシピ内に保存
//       createdAt: serverTimestamp(), // ← 🔥 自動でFirestoreのサーバー時刻を記録
//     };

//     await setDoc(ref, recipe);
//     console.log(`✅ アップロード完了: ${recipe.title}（ID: ${newId}）`);
//   }

//   console.log("✅ 全レシピアップロード完了");
// };

// uploadAllRecipes();
