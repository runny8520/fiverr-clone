import axios from "axios";

//backend port number
const newRequest=axios.create({
    baseURL:"http://localhost:8000/api/",
    withCredentials:true,
})

newRequest.interceptors.request.use((config) => {
    const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrfToken="))
        ?.split("=")[1];

    if (csrfToken && config.method && !["get", "head", "options"].includes(config.method)) {
        config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
});

export default newRequest;