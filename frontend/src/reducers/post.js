
export default (state={posts:[],isLoading:true,currentPage:1,numberOfPages:1},action)=>{
    switch(action.type){
        case 'FETCH_ALL':
            return {...state,posts:action.payload.data,
                currentPage:action.payload.currentPage,
                numberOfPages:action.payload.numberOfPages
            };
        case 'FETCH_BY_SEARCH':
            return {...state,posts:action.payload};
        case 'CREATE':
            return {...state,post:[...state.posts,action.payload]};
        case 'UPDATE':
            return{...state, posts:state.posts.map((post)=>post._id===action.payload._id?action.payload:post)}
        case 'DELETE':
            return {...state,posts:state.posts.filter((post)=>post._id!==action.payload)};
        case 'LIKE':
            return {...state,posts:state.posts.map((post)=>post._id===action.payload._id?action.payload:post)};
        case 'START_LOADING':
            return {...state,isLoading:true};
        case 'END_LOADING':
            return {...state,isLoading:false};
        default:
            return state;
    }   
}