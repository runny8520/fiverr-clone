import React from "react";
import { useNavigate } from "react-router-dom";
import "./notFound.scss";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="notFound">
            <div className="container">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <div className="actions">
                    <button onClick={() => navigate(-1)}>Go Back</button>
                    <button className="home-btn" onClick={() => navigate("/")}>Go to Home</button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
