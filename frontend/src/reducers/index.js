import { combineReducers } from "redux";
import post from "./post";
import auth from "./auth";

export default combineReducers({
    post,auth
});