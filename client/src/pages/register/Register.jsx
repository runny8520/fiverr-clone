import React, { useState } from "react";
import './resgister.scss';
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../../components/toast/Toast";

const Register = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeller = (e) => {
    setUser(prev => ({ ...prev, isSeller: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imgUrl = "";
      if (file) {
        imgUrl = await upload(file);
      }
      await newRequest.post('/auth/register', { ...user, img: imgUrl });
      setToast({ message: "Account created! Redirecting to login...", type: "success" });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setToast({ message: error?.response?.data || "Registration failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="johndoe" onChange={handleChange} required />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="email@example.com" onChange={handleChange} required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={handleChange} required minLength={6} />
          <label htmlFor="avatar">Profile Picture</label>
          <input id="avatar" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          <label htmlFor="country">Country</label>
          <input id="country" name="country" type="text" placeholder="USA" onChange={handleChange} />
          <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
          <p style={{ textAlign: "center", color: "#777", fontSize: "14px" }}>
            Already have an account? <Link to="/login" style={{ color: "#1dbf73" }}>Sign in</Link>
          </p>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="isSeller">Activate the seller account</label>
            <label className="switch">
              <input id="isSeller" type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="text" placeholder="+1 234 567 89" onChange={handleChange} />
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
