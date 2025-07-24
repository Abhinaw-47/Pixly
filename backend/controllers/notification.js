import Notification from '../models/notification.js';

// GET /notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            // Populate sender details. Your User model has 'name'.
            .populate('sender', 'name')
            .sort({ createdAt: -1 }); // Show newest first

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
};

// PATCH /notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }
        if (notification.recipient.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
};