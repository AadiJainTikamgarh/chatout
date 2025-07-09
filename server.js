import { Server } from "socket.io";
import { createServer } from "node:http";
import next from "next";
import Message from "./src/models/message.model.js";
import mongoose from "mongoose";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection",async (socket) => {
    console.log("User Connected : ", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message",async ({ roomId, message, sender }) => {
      const newMessage = new Message({
        chat: new mongoose.Types.ObjectId(roomId),
        content: message,
        from: new mongoose.Types.ObjectId(sender),
      });

      console.log(newMessage)
      await newMessage.save()

      socket.to(roomId).emit("receive-message", {
        message: newMessage.content,
        sender: newMessage.from,
      });
    });

    socket.on("disconnected", () => {
      console.log("User disconnected : ", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http:/${hostname}:${port}`);
    });
});