import api from "../api/api";

export const getDashboard = async () => {
    const response = await api.get("/dashboard");
    return response.data;
};

export const getMyStories = async () => {
    const response = await api.get("/story/my-stories");
    return response.data;
};