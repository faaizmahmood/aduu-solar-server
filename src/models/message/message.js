const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: "",
    },
    file: {
        type: String, // S3 file URL
        default: null,
    },
    mentions: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
