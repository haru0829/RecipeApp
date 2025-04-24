import React from "react";
import "./Profile.scss";
import { Link } from "react-router-dom";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  return (
    <div className="profile">
      <header>
        <h1>@ryo_guitar</h1>
      </header>
      <div className="profileContainer">
        <div className="profileInfo">
          <img
            className="profileIcon"
            src="/images/userIcon.png"
            alt="プロフィール画像"
          />
          <h2 className="profileName">リョウ</h2>
        </div>
        <div className="profileStatsCard">
          <div className="profileStatsItem">
            <p className="profileStatsLabel">レシピ評価</p>
            <p className="profileStatsValue">★ 4.7</p>
          </div>
          <div className="profileStatsItem">
            <p className="profileStatsLabel">達成ユーザー数</p>
            <p className="profileStatsValue">1,200人</p>
          </div>
        </div>
        <section className="profileSection">
          <h3 className="profileSectionTitle">経歴・実績</h3>
          <ul className="profileCareerList">
            <li>・ギター講師歴 7年</li>
            <li>・バンドサポート経験多数</li>
            <li>・YouTube / TikTok 合計フォロワー11万人</li>
          </ul>
        </section>
        <section className="profileSection">
          <h3 className="profileSectionTitle">得意ジャンル</h3>
          <div className="profileTags">
            <span className="profileTag">ギター</span>
            <span className="profileTag">英語</span>
            <span className="profileTag">基本情報技術者</span>
            <span className="profileTag">プログラミング</span>
          </div>
        </section>

        <section className="profileSection">
          <h3 className="profileSectionTitle">作成したレシピ</h3>

          <ul>
            <li className="recipeItem">
              <p className="recipeItemTtl">
                ギターで簡単なコードを弾けるようになって一曲弾いてみよう
              </p>
              <p className="recipeItemPps">目的 : 1曲を弾けるようになる</p>
              <p className="recipeItemTime">期間 : 2週間</p>
              <p className="recipeItemTag">
                #ギター #コード #初心者 #一か月で習得
              </p>
            </li>
            <li className="recipeItem">
              <p className="recipeItemTtl">
                ギターで簡単なコードを弾けるようになって一曲弾いてみよう
              </p>
              <p className="recipeItemPps">目的 : 1曲を弾けるようになる</p>
              <p className="recipeItemTime">期間 : 2週間</p>
              <p className="recipeItemTag">
                #ギター #コード #初心者 #一か月で習得
              </p>
            </li>
          </ul>
        </section>

        <section className="profileSection">
          <h3 className="profileSectionTitle">自己紹介</h3>
          <p className="profileIntroText">
            はじめまして、ギター歴20年のリョウです。独学で始め、今ではバンド活動やライブサポートなども行っています。
            初心者のつまずきポイントや練習方法を分かりやすく伝えるのが得意です。
            音楽の楽しさを、あなたのペースで一緒に体験していきましょう！
          </p>
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
