import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { Link } from "react-router-dom";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.scss";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        // そのユーザーが作成したレシピも取得
        const q = query(
          collection(db, "recipes"),
          where("authorId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const recipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserRecipes(recipes);
      }
      setLoading(false);
    };

    fetchUserData();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (!userData) return <div>ユーザーデータがありません。</div>;

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
        <button
          className="editProfileButton"
          onClick={() => navigate("/edit-profile")}
        >
          プロフィール編集
        </button>

        {/* 評価・達成数カード
        <div className="profileStatsCard">
          <div className="profileStatsItem">
            <p className="profileStatsLabel">レシピ評価</p>
            <p className="profileStatsValue">★ {userData.rating || "4.7"}</p>
          </div>
          <div className="profileStatsItem">
            <p className="profileStatsLabel">達成ユーザー数</p>
            <p className="profileStatsValue">{userData.successCount || "1,200"}人</p>
          </div>
        </div> */}

        {/* 経歴・実績 */}
        <section className="profileSection">
          <h3 className="profileSectionTitle">経歴・実績</h3>
          <ul className="profileCareerList">
            {userData.career?.map((item, index) => (
              <li key={index}>・{item}</li>
            ))}
          </ul>
        </section>

        {/* 得意ジャンル */}
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

        {/* 自己紹介 */}
        <section className="profileSection">
          <h3 className="profileSectionTitle">自己紹介</h3>
          <p className="profileIntroText">{userData.bio}</p>
        </section>

        {/* 作成したレシピ */}
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
                      <p className="recipeItemPps">目的: {recipe.purpose}</p>
                      <p className="recipeItemTime">期間: {recipe.duration}</p>
                      <p className="recipeItemTag">
                        {recipe.tag?.map((t, idx) => (
                          <span key={idx}>#{t} </span>
                        ))}
                      </p>
                    </div>
                    <div className="recipeItemInfo">
                      <p className="recipeStar">★ 4.7</p>
                    </div>
                  </Link>
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
          <Link to="/profile/:id" className="footerNavItem active">
            <PersonIcon />
            <p className="footerNavItemText">マイページ</p>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
