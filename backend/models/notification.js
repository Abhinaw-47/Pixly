import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // The user who will receive the notification
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The user who triggered the notification
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The type of notification
    type: {
        type: String,
        enum: ['like', 'message'],
        required: true,
    },
    // A short message for the notification
    message: {
        type: String,
        required: true,
    },
    // Link to the Post or Message
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;