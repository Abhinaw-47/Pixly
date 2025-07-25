import * as api from '../api';

export const getPosts=(page)=>async(dispatch)=>{
    console.log(page,"page");
try {
    console.log("fetching posts");
    dispatch({type:'START_LOADING'});
    const {data}=await api.fetchPosts(page);
    console.log("post has been fetched");
 console.log(data,"posts");
    dispatch({type:'FETCH_ALL',payload:data});
    dispatch({type:'END_LOADING'});
} catch (error) {
    console.log(error);
}
}
export const getPostsBySearch=(searchQuery)=>async(dispatch)=>{
    try {
        dispatch({type:'START_LOADING'});
        const {data}=await api.fetchPostsBySearch(searchQuery);
        
        dispatch({type:'FETCH_BY_SEARCH',payload:data.data});
        dispatch({type:'END_LOADING'});
    } catch (error) {
        console.log(error);
    }
}
export const createPost=(newPost)=>async(dispatch)=>{
       try {
        dispatch({type:'START_LOADING'});
        const {data}=await api.createPost(newPost);
        dispatch({type:'CREATE',payload:data});
        dispatch({type:'END_LOADING'});
       } catch (error) {
        console.log(error);
       }

}
export const getLikedPosts = () => async (dispatch) => {
    try {
        dispatch({ type: 'START_LOADING' });
        const { data } = await api.getLikedPosts();
        dispatch({ type: 'FETCH_LIKED_POSTS', payload: data.data });
        dispatch({ type: 'END_LOADING' });
    } catch (error) {
        console.log(error);
    }
}
export const updatedPost=(id,updatedPost)=>async(dispatch)=>{
    try {
        const {data}=await api.updatedPost(id,updatedPost);
        dispatch({type:'UPDATE',payload:data});
        
    } catch (error) {
        console.log(error);
    }
}
export const deletePost=(id)=>async(dispatch)=>{
    try {
        await api.deletePost(id);
        dispatch({type:'DELETE',payload:id});
        
    } catch (error) {
        console.log(error);
    }
}

export const likePost=(id)=>async(dispatch)=>{
    try {
        const {data}=await api.likePost(id);
        dispatch({type:'LIKE',payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getProfile=(profile)=>async(dispatch)=>{
    console.log(profile.profile,"profile");
    try {
        dispatch({type:'START_LOADING'});
        const {data}=await api.getProfile(profile.profile);
       
        dispatch({type:'FETCH_PROFILE',payload:data});
         dispatch({type:'END_LOADING'});
    } catch (error) {
        console.log(error);
    }
}

