import * as api from "../api";

export const signIn = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        
        dispatch({ type: "AUTH", data: data });
         api.connectSocket();
       
        navigate("/");
    } catch (error) {
        console.log(error);
    }
}

export const signUp = (formData,navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: "AUTH", data: data });
         api.connectSocket();
        
        navigate("/");
    } catch (error) {
        console.log(error);
    }
}

export const googleSignin = (formData,navigate) => async (dispatch) => {
    try {
        const { data } = await api.googleSignin(formData);
        dispatch({ type: "AUTH", data: data });
        api.connectSocket();
       
        navigate("/");
    } catch (error) {
        console.log(error);
    }
}

