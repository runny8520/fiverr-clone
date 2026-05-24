import React, { useReducer, useState } from "react";
import './add.scss';
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducers";
import upload from '../../utils/upload.js';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/toast/Toast";

const Add = () => {
    const [singleFile, setSingleFile] = useState(undefined);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

    const handleChange = (e) => {
        dispatch({ type: "CHANGE_INPUT", payload: { name: e.target.name, value: e.target.value } });
    };

    const handleFeature = (e) => {
        e.preventDefault();
        const val = e.target[0].value.trim();
        if (val) dispatch({ type: "ADD_FEATURE", payload: val });
        e.target.reset();
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            const cover = await upload(singleFile);
            const images = await Promise.all([...files].map(f => upload(f)));
            dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
            setToast({ message: "Images uploaded successfully!", type: "success" });
        } catch (error) {
            setToast({ message: "Image upload failed. Check your connection.", type: "error" });
        }
        setUploading(false);
    };

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (gig) => newRequest.post("/gigs", gig),
        onSuccess: () => {
            queryClient.invalidateQueries(["myGigs"]);
            setToast({ message: "Gig created!", type: "success" });
            setTimeout(() => navigate('/mygigs'), 1200);
        },
        onError: (err) => {
            setToast({ message: err?.response?.data || "Failed to create gig. Please try again.", type: "error" });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!state.cover) {
            setToast({ message: "Please upload a cover image first.", type: "error" });
            return;
        }
        mutation.mutate(state);
    };

    return (
        <div className="add">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="container">
                <h1>Add New Gig</h1>
                <div className="sections">
                    <div className="left">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g. I will do something I'm really good at"
                            onChange={handleChange}
                        />
                        <label htmlFor="cat">Category</label>
                        <select id="cat" name="cat" onChange={handleChange}>
                            <option value="">Select a category</option>
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
                                <label>Cover Image</label>
                                <input type="file" accept="image/*" onChange={e => setSingleFile(e.target.files[0])} />
                                <label>Gallery Images</label>
                                <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} />
                            </div>
                        </div>
                        <button type="button" onClick={handleUpload}>{uploading ? "Uploading..." : "Upload Images"}</button>
                        <label htmlFor="desc">Description</label>
                        <textarea
                            id="desc"
                            name="desc"
                            cols="30"
                            rows="10"
                            placeholder="A brief description to introduce your service to customers"
                            onChange={handleChange}
                        ></textarea>
                        <button type="button" onClick={handleSubmit} disabled={mutation.isLoading}>
                            {mutation.isLoading ? "Creating..." : "Create Gig"}
                        </button>
                    </div>
                    <div className="right">
                        <label htmlFor="sortTitle">Service Title</label>
                        <input
                            id="sortTitle"
                            type="text"
                            placeholder="e.g. One-page web design"
                            name="sortTitle"
                            onChange={handleChange}
                        />
                        <label htmlFor="sortDesc">Short Description</label>
                        <textarea
                            id="sortDesc"
                            name="sortDesc"
                            onChange={handleChange}
                            placeholder="Short description of your service"
                            cols="30"
                            rows="6"
                        ></textarea>
                        <label htmlFor="deliveryTime">Delivery Time (days)</label>
                        <input
                            id="deliveryTime"
                            type="number"
                            name="deliveryTime"
                            min={1}
                            onChange={handleChange}
                        />
                        <label htmlFor="revisionNumber">Revision Number</label>
                        <input
                            id="revisionNumber"
                            type="number"
                            min={0}
                            name="revisionNumber"
                            onChange={handleChange}
                        />
                        <label>Add Features</label>
                        <form className="add" onSubmit={handleFeature}>
                            <input type="text" placeholder="e.g. page design" />
                            <button type="submit">Add</button>
                        </form>
                        <div className="addedFeatures">
                            {state?.features?.map(f => (
                                <div className="item" key={f}>
                                    <button
                                        type="button"
                                        onClick={() => dispatch({ type: "REMOVE_FEATURE", payload: f })}
                                    >
                                        {f} <span>✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label htmlFor="price">Price ($)</label>
                        <input
                            id="price"
                            type="number"
                            min={1}
                            onChange={handleChange}
                            name="price"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Add;
