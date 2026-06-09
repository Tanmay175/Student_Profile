import Notification from "../models/Notification.js";
import User from "../models/User.js";

// PROFESSOR — send notification to a batch or a specific student
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, batch, toStudent } = req.body;

    if (!title || !message) return res.status(400).json({ message: "Title and message are required" });
    if (type === "batch" && !batch) return res.status(400).json({ message: "Batch is required for batch notification" });
    if (type === "personal" && !toStudent) return res.status(400).json({ message: "Student is required for personal notification" });

    const notification = await Notification.create({
      from: req.user._id,
      title,
      message,
      type,
      batch: type === "batch" ? batch : null,
      toStudent: type === "personal" ? toStudent : null,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROFESSOR — get all notifications sent by this professor
export const getSentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ from: req.user._id })
      .populate("toStudent", "name email")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PROFESSOR — delete a notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, from: req.user._id });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT — get notifications for this student (personal + their batch)
export const getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const notifications = await Notification.find({
      $or: [
        { type: "batch", batch: user.batch },
        { type: "personal", toStudent: user._id },
      ],
    })
      .populate("from", "name")
      .sort({ createdAt: -1 });

    // Add isRead field for this student
    const result = notifications.map((n) => ({
      ...n._doc,
      isRead: n.readBy.includes(req.user._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT — mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT — mark ALL notifications as read
export const markAllRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await Notification.updateMany(
      {
        $or: [
          { type: "batch", batch: user.batch },
          { type: "personal", toStudent: user._id },
        ],
        readBy: { $ne: req.user._id },
      },
      { $addToSet: { readBy: req.user._id } }
    );
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STUDENT — unread count (for badge)
export const getUnreadCount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const count = await Notification.countDocuments({
      $or: [
        { type: "batch", batch: user.batch },
        { type: "personal", toStudent: user._id },
      ],
      readBy: { $ne: req.user._id },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
