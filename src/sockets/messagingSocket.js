const Message = require("../models/message/message");

export const registerMessagingSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("🟢 New client connected");

        // Join project room
        socket.on("joinProject", (projectId) => {
            socket.join(projectId);
            console.log(`Client joined room: ${projectId}`);
        });

        // Handle sendMessage
        socket.on("sendMessage", async (msgData) => {
            try {
                const { projectId, senderId, sender, text, file } = msgData;

                const newMsg = new Message({
                    projectId,
                    senderId,
                    senderName: sender,
                    text,
                    file,
                    timestamp: new Date(),
                });

                await newMsg.save();

                // Emit to everyone in the project room
                io.to(projectId).emit("receiveMessage", newMsg);
            } catch (error) {
                console.error("❌ Error handling message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected");
        });
    });
};
