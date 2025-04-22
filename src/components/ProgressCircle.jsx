import React, { useEffect, useState } from "react";
import "./ProgressCircle.scss";

const ProgressCircle = ({ outerPercent = 83, innerPercent = 43 }) => {
  const radius = 60;
  const stroke = 12;
  const innerRadius = radius - 16;
  const circumference = 2 * Math.PI * radius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  // アニメーション用の状態
  const [animatedOuter, setAnimatedOuter] = useState(0);
  const [animatedInner, setAnimatedInner] = useState(0);

  // アニメーション開始
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedOuter(outerPercent);
      setAnimatedInner(innerPercent);
    }, 100); // マウント後すぐ遷移

    return () => clearTimeout(timeout);
  }, [outerPercent, innerPercent]);

  const getOffset = (percent, circ) => circ - (percent / 100) * circ;

  return (
    <div className="circle-container">
      <svg width="160" height="160">
        {/* 外側背景 */}
        <circle cx="80" cy="80" r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        {/* 外側進捗 */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#6C63FF"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={getOffset(animatedOuter, circumference)}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />

        {/* 内側背景 */}
        <circle cx="80" cy="80" r={innerRadius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        {/* 内側進捗 */}
        <circle
          cx="80"
          cy="80"
          r={innerRadius}
          stroke="#17B8A6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={innerCircumference}
          strokeDashoffset={getOffset(animatedInner, innerCircumference)}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />

        {/* テキスト */}
        <text x="80" y="80" textAnchor="middle" dy=".3em" fontSize="28" fill="#7C3AED" fontWeight="bold">
          {outerPercent}%
        </text>
        <text x="80" y="110" textAnchor="middle" fontSize="16" fill="#14B8A6" fontWeight="bold">
          {innerPercent}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;
