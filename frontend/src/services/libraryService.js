import api from "../api/api";

export const getMyStories = async () => {
    const response = await api.get("/story/my-stories");
    return response.data;
};

export const getStory = async (id) => {
    const response = await api.get(`/story/${id}`);
    return response.data;
};

export const importStory = async (story) => {
    const response = await api.post("/story/import", story);
    return response.data;
};

export const deleteStory = async (id) => {
    await api.delete(`/story/${id}`);
};

export const updateStory = async (id, story) => {
    const response = await api.put(`/story/${id}`, story);
    return response.data;
};
