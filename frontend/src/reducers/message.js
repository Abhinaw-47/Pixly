

export default (state={users:[],isUserLoading:true,messages:[],isMsgLoading:true,selectedUser:null},action)=>{
    switch(action.type){
        case 'FETCH_ALL_USERS':
            return {...state,users:action.payload};
        case 'START_USERS_LOADING':
            return {...state,isUserLoading:true};
        case 'END_USERS_LOADING':
            return {...state,isUserLoading:false};
        case 'FETCH_MESSAGES':
            return {...state,messages:action.payload};
        case 'START_MESSAGES_LOADING':
            return {...state,isMsgLoading:true};
        case 'END_MESSAGES_LOADING':
            return {...state,isMsgLoading:false};
        case 'SELECT_USER':
            return {...state,selectedUser:action.payload};
        case 'SEND_MESSAGE':
            return {...state,messages:[...state.messages,action.payload]};
        default:
            return state;
    }
}