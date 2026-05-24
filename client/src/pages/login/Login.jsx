import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './login.scss';
import newRequest from "../../utils/newRequest";
import Toast from "../../components/toast/Toast";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await newRequest.post('/auth/login', { username, password });
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setToast({ message: err?.response?.data || "Login failed. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <form onSubmit={handleSubmit}>
                <h1>Sign in</h1>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>
                <p style={{ textAlign: "center", color: "#777", fontSize: "14px" }}>
                    Don't have an account? <Link to="/register" style={{ color: "#1dbf73" }}>Register</Link>
                </p>
            </form>
        </div>
    );
}
export default Login;
