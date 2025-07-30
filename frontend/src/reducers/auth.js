export default (state = { authData: null, onlineUsers: [] }, action) => {
    switch (action.type) {
        case 'AUTH':
            localStorage.setItem('profile', JSON.stringify({
                ...action?.data,
                accessToken: action.data.accessToken,
                refreshToken: action.data.refreshToken,
            }));
            return { ...state, authData: action?.data };
            
        case 'LOGOUT':
            localStorage.clear();
            return { ...state, authData: null, onlineUsers: [] };

        
        case 'SET_ONLINE_USERS':
        case 'UPDATE_ONLINE_USERS':
            console.log('Reducer: Setting online users:', action.payload);
            return { 
                ...state, 
                onlineUsers: Array.isArray(action.payload) ? action.payload : [] 
            };

        case 'USER_ONLINE':
            console.log('Reducer: User came online:', action.payload);
            const currentOnlineUsers = Array.isArray(state.onlineUsers) ? state.onlineUsers : [];
          
            if (!currentOnlineUsers.includes(action.payload)) {
                return {
                    ...state,
                    onlineUsers: [...currentOnlineUsers, action.payload]
                };
            }
            return state;

        case 'USER_OFFLINE':
            console.log('Reducer: User went offline:', action.payload);
            const filteredUsers = Array.isArray(state.onlineUsers) 
                ? state.onlineUsers.filter(id => id !== action.payload)
                : [];
            return {
                ...state,
                onlineUsers: filteredUsers
            };

        default:
            return state;
    }
};