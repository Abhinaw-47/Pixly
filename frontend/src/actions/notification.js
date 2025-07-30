

import * as api from '../api';


export const getNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: 'START_NOTIFICATIONS_LOADING' });
    const { data } = await api.getNotifications();
    dispatch({ type: 'FETCH_NOTIFICATIONS', payload: data });
    dispatch({ type: 'END_NOTIFICATIONS_LOADING' });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};


export const addNewNotification = (notification) => (dispatch) => {

  dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
};


export const markAsRead = (id) => async (dispatch) => {
  try {
    const { data } = await api.markNotificationAsRead(id);

    dispatch({ type: 'UPDATE_NOTIFICATION', payload: data });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};