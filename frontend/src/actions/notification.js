// actions/notification.js

import * as api from '../api';

// Action to get all notifications for the logged-in user
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

// Action to add a new notification received via socket
export const addNewNotification = (notification) => (dispatch) => {
  // You can add a toast notification here for a better UX!
  // e.g., toast.info(notification.message);
  dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
};

// Action to mark a notification as read
export const markAsRead = (id) => async (dispatch) => {
  try {
    const { data } = await api.markNotificationAsRead(id);
    // Update the specific notification in the state
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: data });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};