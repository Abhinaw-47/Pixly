import { disconnectSocket } from "../api";
export const logout = (dispatch, navigate) => {
    localStorage.removeItem("profile");
    disconnnectSocket();
    dispatch({ type: "LOGOUT" });
    navigate("/");
}