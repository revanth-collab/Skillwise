import axios from "axios";

const api = axios.create({
    baseURL: "https://skillwise-jvbg.onrender.com/api/products",
});

// pagination + sorting + filtering
export const getProducts = (params) => api.get("/", { params });

export const searchProducts = (name) =>
    api.get("/search", { params: { name } });

export const addProduct = (data) => api.post("/", data);

export const updateProduct = (id, data) => api.put(`/${id}`, data);

export const deleteProduct = (id) => api.delete(`/${id}`);

export const getHistory = (id) => api.get(`/${id}/history`);

export const importCSV = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const exportCSV = () =>
    api.get("/export", { responseType: "blob" });
