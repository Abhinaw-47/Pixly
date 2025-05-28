

export default (state={authData:null,onlineUsers:[]},action)=>{
    switch(action.type){
        case 'AUTH':
            localStorage.setItem('profile',JSON.stringify({...action?.data}));
            return {...state,authData:action?.data};
        case 'LOGOUT':
            localStorage.clear();
            return {...state,authData:null};

        case 'SET_ONLINE_USERS':
            return {...state,onlineUsers:action.payload}; 
        default:
            return state;
    }
}