const mongoose = require("mongoose");
const Message = require("../models/message/message");
const User = require("../models/User");
const Staff = require("../models/staff");

const registerMessagingSocket = (io) => {
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
                    projectId: new mongoose.Types.ObjectId(projectId),
                    senderId: new mongoose.Types.ObjectId(senderId),
                    senderName: sender,
                    text,
                    file,
                });

                const savedMsg = await newMsg.save();
                console.log("💾 Message saved:", savedMsg);

                io.to(projectId).emit("receiveMessage", savedMsg);

            } catch (error) {
                console.error("❌ Error handling message:", error);
            }
        });

        // Server-side handler for updateLastReadMessage event
        socket.on("updateLastReadMessage", async (payload) => {
            try {
                const { projectId, userId, userType } = payload;

                // Handle the user type logic
                if (userType === 'simple') {
                    // For a simple user (client/admin), update lastReadMessages in the User model
                    const user = await User.findOne({ _id: userId });

                    if (user) {
                        // Check if the user already has the projectId in lastReadMessages
                        const existingMessage = user.lastReadMessages.find(
                            (msg) => msg.projectId.toString() === projectId.toString()
                        );

                        if (existingMessage) {
                            // If the projectId already exists, update lastReadAt
                            existingMessage.lastReadAt = new Date();
                        } else {
                            // If it doesn't exist, add a new entry for that project
                            user.lastReadMessages.push({
                                projectId,
                                lastReadAt: new Date(),
                            });
                        }

                        // Save the user after updating lastReadMessages
                        await user.save();
                    }
                } else {
                    // For a staff user, update lastReadMessages in the Staff model
                    const staff = await Staff.findOne({ _id: userId });

                    if (staff) {
                        // Check if the staff already has the projectId in lastReadMessages
                        const existingMessage = staff.lastReadMessages.find(
                            (msg) => msg.projectId.toString() === projectId.toString()
                        );

                        if (existingMessage) {
                            // If the projectId already exists, update lastReadAt
                            existingMessage.lastReadAt = new Date();
                        } else {
                            // If it doesn't exist, add a new entry for that project
                            staff.lastReadMessages.push({
                                projectId,
                                lastReadAt: new Date(),
                            });
                        }

                        // Save the staff after updating lastReadMessages
                        await staff.save();
                    }
                }
            } catch (error) {
                console.error("❌ Error Updating last Read Message:", error);
            }
        });


        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected");
        });
    });
};



module.exports = registerMessagingSocket;