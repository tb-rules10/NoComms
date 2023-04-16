const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to DB");
    console.log("-----------------------------------------------");
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT || 5000, () => {
    console.log("Server started on " + process.env.PORT);
})

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});


global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId, username) => {
        console.log(`---> User Login - ${username}`);
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", {
                msg: data.msg,
                title: data.title
            });
        }
    });
});
