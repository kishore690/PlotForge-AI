import api from "../api/api";

export const createStory = async (story) => {
    const response = await api.post("/story/create", story);
    return response.data;
};

export const generateStory = async (id) => {
    const response = await api.post(`/story/${id}/generate`);
    return response.data;
};