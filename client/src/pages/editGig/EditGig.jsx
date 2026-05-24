import React, { useState, useEffect } from "react";
import '../add/add.scss';
import './editGig.scss';
import upload from '../../utils/upload.js';
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../../components/toast/Toast";

const EditGig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [singleFile, setSingleFile] = useState(undefined);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const [state, setState] = useState(null);

    const { isLoading, error, data } = useQuery({
        queryKey: ["editGig", id],
        queryFn: () => newRequest.get(`/gigs/single/${id}`).then(res => res.data),
    });

    useEffect(() => {
        if (data && !state) setState(data);
    }, [data, state]);

    const handleChange = (e) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFeature = (e) => {
        e.preventDefault();
        const val = e.target[0].value.trim();
        if (val) setState(prev => ({ ...prev, features: [...(prev.features || []), val] }));
        e.target.reset();
    };

    const removeFeature = (f) => {
        setState(prev => ({ ...prev, features: prev.features.filter(x => x !== f) }));
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            const cover = singleFile ? await upload(singleFile) : state.cover;
            const newImages = files.length > 0
                ? await Promise.all([...files].map(f => upload(f)))
                : state.images;
            setState(prev => ({ ...prev, cover, images: newImages }));
            setToast({ message: "Images uploaded!", type: "success" });
        } catch {
            setToast({ message: "Image upload failed", type: "error" });
        }
        setUploading(false);
    };

    const mutation = useMutation({
        mutationFn: (gig) => newRequest.put(`/gigs/${id}`, gig),
        onSuccess: () => {
            queryClient.invalidateQueries(["myGigs"]);
            queryClient.invalidateQueries(["gig"]);
            setToast({ message: "Gig updated!", type: "success" });
            setTimeout(() => navigate('/mygigs'), 1200);
        },
        onError: (err) => {
            setToast({ message: err?.response?.data || "Update failed", type: "error" });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(state);
    };

    if (isLoading) return <div className="add"><div className="container"><p>Loading gig...</p></div></div>;
    if (error) return <div className="add"><div className="container"><p style={{color:"red"}}>Failed to load gig.</p></div></div>;
    if (!state) return null;

    return (
        <div className="add">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="container">
                <h1>Edit Gig</h1>
                <div className="sections">
                    <div className="left">
                        <label>Title</label>
                        <input type="text" name="title" value={state.title || ""} onChange={handleChange} placeholder="Gig title" />
                        <label>Category</label>
                        <select name="cat" value={state.cat || ""} onChange={handleChange}>
                            <option value="Design">Design</option>
                            <option value="Web developer">Web Developer</option>
                            <option value="Animation">Animation</option>
                            <option value="Music">Music</option>
                            <option value="Graphics & Design">Graphics & Design</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Writing & Translation">Writing & Translation</option>
                            <option value="Video & Animation">Video & Animation</option>
                            <option value="Music & Audio">Music & Audio</option>
                            <option value="Programming & Tech">Programming & Tech</option>
                            <option value="Business">Business</option>
                            <option value="Lifestyle">Lifestyle</option>
                        </select>
                        <div className="images">
                            <div className="imagesInputs">
                                <label>Cover Image (leave blank to keep current)</label>
                                <input type="file" onChange={e => setSingleFile(e.target.files[0])} />
                                <label>Gallery Images (leave blank to keep current)</label>
                                <input type="file" multiple onChange={e => setFiles(e.target.files)} />
                            </div>
                        </div>
                        <button type="button" onClick={handleUpload}>{uploading ? "Uploading..." : "Upload Images"}</button>
                        <label>Description</label>
                        <textarea name="desc" rows={8} value={state.desc || ""} onChange={handleChange} placeholder="Description" />
                        <button type="button" onClick={handleSubmit} disabled={mutation.isLoading}>
                            {mutation.isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    <div className="right">
                        <label>Service Title</label>
                        <input type="text" name="sortTitle" value={state.sortTitle || ""} onChange={handleChange} placeholder="e.g. One-page web design" />
                        <label>Short Description</label>
                        <textarea name="sortDesc" rows={5} value={state.sortDesc || ""} onChange={handleChange} placeholder="Short description" />
                        <label>Delivery Time (days)</label>
                        <input type="number" name="deliveryTime" min={1} value={state.deliveryTime || ""} onChange={handleChange} />
                        <label>Revision Number</label>
                        <input type="number" name="revisionNumber" min={0} value={state.revisionNumber || ""} onChange={handleChange} />
                        <label>Add Features</label>
                        <form className="add" onSubmit={handleFeature}>
                            <input type="text" placeholder="e.g. page design" />
                            <button type="submit">Add</button>
                        </form>
                        <div className="addedFeatures">
                            {(state.features || []).map(f => (
                                <div className="item" key={f}>
                                    <button type="button" onClick={() => removeFeature(f)}>
                                        {f} <span>✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label>Price ($)</label>
                        <input type="number" name="price" value={state.price || ""} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGig;
