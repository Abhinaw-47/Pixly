import * as api from "../api";



export const fetchUsers=()=>async(dispatch)=>{
    try {
        console.log("fetching users");
        dispatch({type:'START_USERS_LOADING'});
        console.log("fetching users  123");
        const {data}=await api.fetchUsers();
        console.log("data has been fetched");
        dispatch({type:'FETCH_ALL_USERS',payload:data});
        dispatch({type:'END_USERS_LOADING'});
    } catch (error) {
        console.log(error);
    }
}

export const getMessages=(userId)=>async(dispatch)=>{
    try {
        dispatch({type:'START_MESSAGES_LOADING'});
        const {data}=await api.getMessages(userId);
        dispatch({type:'FETCH_MESSAGES',payload:data});
        dispatch({type:'END_MESSAGES_LOADING'});
    } catch (error) {
        console.log(error);
    }

}
export const sendMessage=(id,message)=>async(dispatch)=>{
    console.log(id,message);
    try {
        const {data}=await api.sendMessage(id,message);
        console.log(data);
        dispatch({type:'SEND_MESSAGE',payload:data});
    } catch (error) {
        console.log("not working");
        console.log(error);
    }
}
export const fetchAllMessages = () => async (dispatch) => {
    try {
        dispatch({ type: 'START_MESSAGES_LOADING' });
        const { data } = await api.fetchAllMessages();
        dispatch({ type: 'FETCH_MESSAGES', payload: data });
        dispatch({ type: 'END_MESSAGES_LOADING' });
    } catch (error) {
        console.log(error);
    }
}
