import api from "../api/api";

export const login = async (loginData) => {

    const response = await api.post(
        "/auth/login",
        loginData
    );

    return response.data;
};

export const register = async (registerData) => {

    const response = await api.post(
        "/auth/register",
        registerData
    );

    return response.data;
};

export const loginWithGoogle = async (credential) => {
    const response = await api.post("/auth/google", { credential });
    return response.data;
};
