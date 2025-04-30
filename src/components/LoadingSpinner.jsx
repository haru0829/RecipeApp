// components/LoadingSpinner.jsx
import React from "react";
import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loadingOverlay">
      <div className="spinner" />
      <p>読み込み中...</p>
    </div>
  );
};

export default LoadingSpinner;
