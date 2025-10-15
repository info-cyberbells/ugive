import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";

//Login Student
export const loginService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN_USER, userData, {
        withCredentials: true,
    });
    return response.data;
};

//Register Student
export const registerService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.REGISTER_USER, userData);
    return response.data;
}