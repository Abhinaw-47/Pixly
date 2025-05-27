import { combineReducers } from "redux";
import post from "./post";
import auth from "./auth";
import message from "./message";
import socket from "./socket";

export default combineReducers({
    post,auth,message,socket
});