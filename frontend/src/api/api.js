import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = configuredBaseUrl
    ? `${configuredBaseUrl.replace(/\/$/, "")}${configuredBaseUrl.endsWith("/api") ? "" : "/api"}`
    : import.meta.env.DEV
        ? "http://localhost:8081/api"
        : "/api";

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";
        const isAuthRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");
        if ([401, 403].includes(error.response?.status) && !isAuthRequest && localStorage.getItem("token")) {
            localStorage.removeItem("token");
            const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                window.location.assign(`/login?session=expired&returnTo=${encodeURIComponent(returnTo)}`);
            }
        }
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An unexpected error occurred";
        return Promise.reject(new Error(message));
    }
);

export default api;
