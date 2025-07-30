import * as api from '../api';

export const getComments = (postId, page = 1) => async (dispatch) => {
    try {
        console.log(`Fetching comments for post ${postId}, page ${page}`);
        dispatch({ type: 'COMMENTS_LOADING', payload: { postId } });
        
        const { data } = await api.getComments(postId, page);
        console.log('Comments API response:', data);
        
        dispatch({ 
            type: 'FETCH_COMMENTS_SUCCESS', 
            payload: { 
                postId,
                comments: data.data, 
                totalComments: data.totalComments,
                currentPage: data.currentPage,
                numberOfPages: data.numberOfPages,
                append: page > 1
            } 
        });
        return data;
    } catch (error) {
        console.error('Error in getComments action:', error);
        dispatch({ 
            type: 'COMMENTS_ERROR', 
            payload: { postId, error: error.response?.data?.message || error.message } 
        });
        throw error;
    }
};

export const addComment = (postId, text) => async (dispatch) => {
    try {
        console.log(`Adding comment to post ${postId}:`, text);
        const { data } = await api.addComment(postId, text);
        console.log('Add comment API response:', data);
        
        dispatch({ 
            type: 'ADD_COMMENT_SUCCESS', 
            payload: { postId, comment: data } 
        });
        return data;
    } catch (error) {
        console.error('Error in addComment action:', error);
        dispatch({ 
            type: 'ADD_COMMENT_ERROR', 
            payload: { postId, error: error.response?.data?.message || error.message } 
        });
        throw error;
    }
};

export const deleteComment = (commentId, postId) => async (dispatch) => {
    try {
        console.log(`Deleting comment ${commentId} from post ${postId}`);
        await api.deleteComment(commentId);
        
        dispatch({ 
            type: 'DELETE_COMMENT_SUCCESS', 
            payload: { commentId, postId } 
        });
    } catch (error) {
        console.error('Error in deleteComment action:', error);
        dispatch({ 
            type: 'DELETE_COMMENT_ERROR', 
            payload: { postId, error: error.response?.data?.message || error.message } 
        });
        throw error;
    }
};

export const likeComment = (commentId, postId) => async (dispatch) => {
    try {
        console.log(`Liking comment ${commentId} in post ${postId}`);
        const { data } = await api.likeComment(commentId);
        console.log('Like comment API response:', data);
        
        dispatch({ 
            type: 'LIKE_COMMENT_SUCCESS', 
            payload: { postId, comment: data } 
        });
        return data;
    } catch (error) {
        console.error('Error in likeComment action:', error);
        dispatch({ 
            type: 'LIKE_COMMENT_ERROR', 
            payload: { postId, error: error.response?.data?.message || error.message } 
        });
        throw error;
    }
};