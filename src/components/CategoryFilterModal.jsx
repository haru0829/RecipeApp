import React from "react";
import "./CategoryFilterModal.scss";

const categoryOptions = [
  "楽器", "語学", "運動・ボディメイク", "プログラミング",
  "資格・学習", "ビジネススキル", "趣味・創作",
  "旅行・アウトドア", "ゲーム", "投資・お金",
  "習慣化チャレンジ", "生活スキル・家事", "美容・セルフケア"
];

const CategoryFilterModal = ({ selectedCategories, onToggleCategory, onClear, onApply, onClose, resultCount }) => {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>絞り込む</h2>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          <p className="label">カテゴリ</p>
          <div className="chipContainer">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                className={`filterChip ${selectedCategories.includes(cat) ? "selected" : ""}`}
                onClick={() => onToggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="modalFooter">
          <button className="clearBtn" onClick={onClear}>クリアする</button>
          <button className="applyBtn" onClick={onApply}>
            {resultCount} 件の検索結果
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterModal;
