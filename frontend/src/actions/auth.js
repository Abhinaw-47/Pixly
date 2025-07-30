import * as api from "../api";
import { toast } from 'react-toastify';

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: "AUTH", data: data });
    api.connectSocket();
    navigate("/");
  } catch (error) {
    console.log("error in signin:", error);
    toast.error(error?.response?.data?.message || "Wrong credentials");
  }
};

export const signUp = (formData, navigate, onSuccess) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
   
    toast.success(data.message);
    
   
    if (onSuccess) onSuccess(data.userId);
    
    
    
  } catch (error) {
    console.log("error in signup:", error);
    toast.error(error?.response?.data?.message || "Signup failed");
  }
};

export const verifyOtp = (otpData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtp(otpData);
    
  
    dispatch({ type: "AUTH", data: data });
    api.connectSocket();
    toast.success("Account verified successfully!");
    navigate("/");
    
  } catch (error) {
    console.log("error in otp verification:", error);
    toast.error(error?.response?.data?.message || "OTP verification failed");
  }
}

export const googleSignin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleSignin(formData);
    dispatch({ type: "AUTH", data: data });
    api.connectSocket();
    navigate("/");
  } catch (error) {
    console.log("error in google signin:", error);
    toast.error(error?.response?.data?.message || "Google signin failed");
  }
};