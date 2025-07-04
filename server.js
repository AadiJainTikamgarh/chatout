import { Server } from "socket.io";
import { createServer } from "node:http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("User Connected : ", socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId)
      console.log(`${socket.id} joined room ${roomId}`)
    })

    socket.on('send-message', ({roomId, message, sender}) => {
      socket.to(roomId).emit('receive-message', {
        message,
        sender
      })
    })
  
    socket.on('disconnected', () => {
      console.log('User disconnected : ', socket.id)
    })

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
