import React, { useEffect } from "react";
import "./toast.scss";

const Toast = ({ message, type = "error", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast--${type}`}>
            <span className="toast__msg">{message}</span>
            <button className="toast__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
    );
};

export default Toast;
