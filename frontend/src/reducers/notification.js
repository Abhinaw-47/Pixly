

const initialState = {
  isLoading: false,
  notifications: [],
  unreadCount: 0,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_NOTIFICATIONS_LOADING':
      return { ...state, isLoading: true };
    case 'END_NOTIFICATIONS_LOADING':
      return { ...state, isLoading: false };

    case 'FETCH_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
       
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case 'UPDATE_NOTIFICATION':
      const updatedNotifications = state.notifications.map(n =>
        n._id === action.payload._id ? action.payload : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
       
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };
      
    case 'LOGOUT': 
        return initialState;

    default:
      return state;
  }
};

export default notificationReducer;