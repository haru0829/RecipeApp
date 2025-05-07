import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import "./Profile.scss";
import "./RecipeCard.scss";
import LoadingSpinner from "./LoadingSpinner";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userCounts, setUserCounts] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);

        const userIdToFetch = id ? id : user.uid;
        const userRef = doc(db, "users", userIdToFetch);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);

          const q = query(
            collection(db, "recipes"),
            where("authorId", "==", userIdToFetch)
          );
          const snapshot = await getDocs(q);
          const recipes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserRecipes(recipes);

          const usersSnapshot = await getDocs(collection(db, "users"));
          const counts = {};
          usersSnapshot.forEach((userDoc) => {
            const progress = userDoc.data().progress;
            if (progress) {
              recipes.forEach((r) => {
                if (progress[r.id]) {
                  counts[r.id] = (counts[r.id] || 0) + 1;
                }
              });
            }
          });
          setUserCounts(counts);
        }
      }
      setLoading(false);
    });

    window.scrollTo(0, 0);
    return () => unsubscribe();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!userData) return <div>ユーザーデータがありません。</div>;

  const isMyProfile = !id || id === currentUserId;

  return (
    <div className="profile">
      <header>
        <h1>@{userData.accountId}</h1>
      </header>

      <div className="profileContainer">
        <div className="profileInfo">
          <img
            className="profileIcon"
            src={userData.profileImage || "/images/defaultIcon.png"}
            alt="プロフィール画像"
          />
          <h2 className="profileName">{userData.name}</h2>
        </div>

        {isMyProfile && (
          <button
            className="editProfileButton"
            onClick={() => navigate("/edit-profile")}
          >
            プロフィール編集
          </button>
        )}

        <section className="profileSection">
          <h3 className="profileSectionTitle">経歴・実績</h3>
          <ul className="profileCareerList">
            {userData.career?.map((item, index) => (
              <li key={index}>・{item}</li>
            ))}
          </ul>
        </section>

        <section className="profileSection">
          <h3 className="profileSectionTitle">得意ジャンル</h3>
          <div className="profileTags">
            {userData.genres?.map((genre, index) => (
              <span key={index} className="profileTag">
                {genre}
              </span>
            ))}
          </div>
        </section>

        <section className="profileSection">
          <h3 className="profileSectionTitle">自己紹介</h3>
          <p className="profileIntroText">{userData.bio || "未設定"}</p>
        </section>

        <section className="profileSection">
          <h3 className="profileSectionTitle">作成したレシピ</h3>
          {userRecipes.length === 0 ? (
            <p>作成したレシピはまだありません。</p>
          ) : (
            <ul className="profileRecipeList">
              {userRecipes.map((recipe) => (
                <li className="recipeItem" key={recipe.id}>
                  <Link
                    to={`/recipe-detail/${recipe.id}`}
                    className="recipeItemWrapper"
                  >
                    <img
                      src={recipe.image || "/images/placeholder.png"}
                      alt={recipe.title}
                      className="recipeItemImg"
                    />
                    <div className="recipeItemContent">
                      <p className="recipeItemTtl">{recipe.title}</p>

                      <span
                        className={`recipeItemCategory category-${recipe.category}`}
                      >
                        {recipe.category}
                      </span>
                      <p className="recipeItemUserCount">
                        これまでの挑戦者: {userCounts[recipe.id] || 0}人
                      </p>
                      <p className="recipeItemPps">
                        目的: {recipe.description || "未設定"}
                      </p>
                      <p className="recipeItemTime">
                        期間: {recipe.duration || "未設定"}
                      </p>
                      <p className="recipeItemTag">
                        {recipe.tag?.map((t, idx) => (
                          <span key={idx}>#{t} </span>
                        ))}
                      </p>
                    </div>
                  </Link>
                  <div className="recipeItemInfo">
                    <Link
                      to={`/profile/${recipe.authorId}`}
                      className="userLink"
                    >
                      {/* <div className="userInfo">
                        <img
                          className="userIcon"
                          src={recipe.authorImage || "/images/defaultIcon.png"}
                          alt="プロフィール画像"
                        />
                        <h2 className="userName">{recipe.authorName}</h2>
                      </div> */}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer>
        <div className="footerNav">
          <Link to="/" className="footerNavItem">
            <HomeFilledIcon />
            <p className="footerNavItemText">ホーム</p>
          </Link>
          <Link to="/recipes" className="footerNavItem">
            <DescriptionIcon />
            <p className="footerNavItemText">レシピ</p>
          </Link>
          <Link
            to={`/profile/${auth.currentUser?.uid}`}
            className="footerNavItem active"
          >
            <PersonIcon />
            <p className="footerNavItemText">マイページ</p>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
