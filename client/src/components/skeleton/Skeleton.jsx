import React from "react";
import "./skeleton.scss";

export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton-img shimmer"></div>
        <div className="skeleton-info">
            <div className="skeleton-user shimmer"></div>
            <div className="skeleton-line shimmer"></div>
            <div className="skeleton-line short shimmer"></div>
        </div>
        <div className="skeleton-footer shimmer"></div>
    </div>
);

export const SkeletonRow = () => (
    <div className="skeleton-row">
        <div className="skeleton-cell shimmer"></div>
        <div className="skeleton-cell wide shimmer"></div>
        <div className="skeleton-cell shimmer"></div>
        <div className="skeleton-cell shimmer"></div>
    </div>
);

export const SkeletonText = ({ lines = 3 }) => (
    <div className="skeleton-text">
        {Array(lines).fill(null).map((_, i) => (
            <div key={i} className={`skeleton-line shimmer${i === lines - 1 ? " short" : ""}`}></div>
        ))}
    </div>
);

export default SkeletonCard;
