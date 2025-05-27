// redux/reducers/socketReducer.js

const initialState = {
  socket: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'CLEAR_SOCKET':
      return { ...state, socket: null };
    default:
      return state;
  }
};

;
