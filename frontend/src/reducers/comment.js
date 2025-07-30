const initialState = {
    commentsByPost: {},
    loading: {},       
    error: {},          
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'COMMENTS_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.postId]: true
                },
                error: {
                    ...state.error,
                    [action.payload.postId]: null
                }
            };
            
        case 'FETCH_COMMENTS_SUCCESS':
            const { postId, comments, totalComments, currentPage, numberOfPages, append } = action.payload;
            const existingComments = state.commentsByPost[postId]?.comments || [];
            
            return {
                ...state,
                commentsByPost: {
                    ...state.commentsByPost,
                    [postId]: {
                        comments: append 
                            ? [...existingComments, ...comments]
                            : comments,
                        totalComments,
                        currentPage,
                        numberOfPages,
                        hasMore: currentPage < numberOfPages
                    }
                },
                loading: {
                    ...state.loading,
                    [postId]: false
                },
                error: {
                    ...state.error,
                    [postId]: null
                }
            };
            
        case 'ADD_COMMENT_SUCCESS':
            const addPostId = action.payload.postId;
            const newComment = action.payload.comment;
            const currentPostComments = state.commentsByPost[addPostId];
            
            return {
                ...state,
                commentsByPost: {
                    ...state.commentsByPost,
                    [addPostId]: {
                        comments: [newComment, ...(currentPostComments?.comments || [])],
                        totalComments: (currentPostComments?.totalComments || 0) + 1,
                        currentPage: currentPostComments?.currentPage || 1,
                        numberOfPages: currentPostComments?.numberOfPages || 1,
                        hasMore: currentPostComments?.hasMore || false
                    }
                }
            };
            
        case 'DELETE_COMMENT_SUCCESS':
            const deletePostId = action.payload.postId;
            const deletedCommentId = action.payload.commentId;
            const postComments = state.commentsByPost[deletePostId];
            
            if (!postComments) return state;
            
            return {
                ...state,
                commentsByPost: {
                    ...state.commentsByPost,
                    [deletePostId]: {
                        ...postComments,
                        comments: postComments.comments.filter(
                            comment => comment._id !== deletedCommentId
                        ),
                        totalComments: Math.max(postComments.totalComments - 1, 0)
                    }
                }
            };
            
        case 'LIKE_COMMENT_SUCCESS':
            const likePostId = action.payload.postId;
            const updatedComment = action.payload.comment;
            const likePostComments = state.commentsByPost[likePostId];
            
            if (!likePostComments) return state;
            
            return {
                ...state,
                commentsByPost: {
                    ...state.commentsByPost,
                    [likePostId]: {
                        ...likePostComments,
                        comments: likePostComments.comments.map(comment =>
                            comment._id === updatedComment._id ? updatedComment : comment
                        )
                    }
                }
            };
            
        case 'COMMENTS_ERROR':
        case 'ADD_COMMENT_ERROR':
        case 'DELETE_COMMENT_ERROR':
        case 'LIKE_COMMENT_ERROR':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.postId]: false
                },
                error: {
                    ...state.error,
                    [action.payload.postId]: action.payload.error
                }
            };
            
        default:
            return state;
    }
};