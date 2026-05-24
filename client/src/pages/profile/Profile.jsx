import React, { useState } from "react";
import "./profile.scss";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import Toast from "../../components/toast/Toast";
import { SkeletonText } from "../../components/skeleton/Skeleton";

const Profile = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isOwner = currentUser?._id === id;

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const { isLoading, error, data } = useQuery({
        queryKey: ["profile", id],
        queryFn: () => newRequest.get(`/users/${id}`).then(res => res.data),
        onSuccess: (d) => { if (!form) setForm(d); }
    });

    const mutation = useMutation({
        mutationFn: (updates) => newRequest.put(`/users/${id}`, updates),
        onSuccess: (res) => {
            queryClient.invalidateQueries(["profile", id]);
            if (isOwner) localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...res.data }));
            setEditing(false);
            setToast({ message: "Profile updated successfully!", type: "success" });
        },
        onError: (err) => {
            setToast({ message: err?.response?.data || "Update failed", type: "error" });
        }
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imgUrl = form.img;
        if (file) {
            setUploading(true);
            try {
                imgUrl = await upload(file);
            } catch {
                setToast({ message: "Image upload failed", type: "error" });
                setUploading(false);
                return;
            }
            setUploading(false);
        }
        mutation.mutate({ ...form, img: imgUrl });
    };

    if (isLoading) return (
        <div className="profile">
            <div className="container">
                <div className="avatar-placeholder shimmer"></div>
                <SkeletonText lines={5} />
            </div>
        </div>
    );

    if (error) return <div className="profile"><div className="container"><p className="err">User not found.</p></div></div>;

    const user = data;
    const editData = form || user;

    return (
        <div className="profile">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="container">
                <div className="header">
                    <div className="avatar-wrap">
                        {editing ? (
                            <label className="avatar-edit">
                                <img src={file ? URL.createObjectURL(file) : (editData.img || "/images/noavtar.jpeg")} alt="avatar" className="avatar" />
                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} hidden />
                                <span className="edit-overlay">Change Photo</span>
                            </label>
                        ) : (
                            <img src={user.img || "/images/noavtar.jpeg"} alt="avatar" className="avatar" />
                        )}
                    </div>
                    <div className="info">
                        <h1>{user.username}</h1>
                        <p className="country">{user.country}</p>
                        {user.isSeller && <span className="badge seller-badge">Seller</span>}
                        {user.isAdmin && <span className="badge admin-badge">Admin</span>}
                        {isOwner && !editing && (
                            <button className="edit-btn" onClick={() => { setForm(user); setEditing(true); }}>Edit Profile</button>
                        )}
                    </div>
                </div>

                {editing ? (
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <div className="field">
                            <label>Username</label>
                            <input name="username" value={editData.username || ""} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label>Country</label>
                            <input name="country" value={editData.country || ""} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label>Phone</label>
                            <input name="phone" value={editData.phone || ""} onChange={handleChange} />
                        </div>
                        <div className="field">
                            <label>Description / Bio</label>
                            <textarea name="desc" rows={5} value={editData.desc || ""} onChange={handleChange} />
                        </div>
                        <div className="actions">
                            <button type="submit" className="save-btn" disabled={mutation.isLoading || uploading}>
                                {mutation.isLoading || uploading ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => { setEditing(false); setFile(null); }}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="details">
                        {user.desc && (
                            <div className="section">
                                <h3>About</h3>
                                <p>{user.desc}</p>
                            </div>
                        )}
                        <div className="section meta">
                            {user.country && <div className="meta-item"><strong>Country:</strong> {user.country}</div>}
                            {user.phone   && <div className="meta-item"><strong>Phone:</strong> {user.phone}</div>}
                            {user.email   && isOwner && <div className="meta-item"><strong>Email:</strong> {user.email}</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
