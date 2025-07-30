import { combineReducers } from "redux";
import post from "./post";
import auth from "./auth";
import message from "./message";
import socket from "./socket";
import notifications from './notification';
import comments from "./comment";

export default combineReducers({
    post,auth,message,socket,notifications,comments
});