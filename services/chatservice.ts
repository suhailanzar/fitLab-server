import { Server as httpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Message } from "../models/Message";


interface User {
  userId: string;
  role: string;
}


export function configureSocket(expressServer: httpServer) {

  const io = new SocketIOServer(expressServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  const rooms: Record<string, User[]> = {};
  const broadcasters: Record<string, string> = {};
  io.on("connection", (socket) => {

    // Join a room
    socket.on('joinRoom', (roomId: string) => {
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
    });

    // Leave a room
    socket.on('leaveRoom', (roomId: string) => {
      console.log(`User ${socket.id} left room ${roomId}`);
      socket.leave(roomId);

    });

    // Handle sendMessage
    socket.on('sendMessage', async (data: { senderId: string, receiverId: string, message: string }) => {

      const { senderId, receiverId, message } = data;
      console.log('message is ', message);

      // Emit message to the room
      const roomId = getRoomId(senderId, receiverId);

      const newMessage = new Message({ senderId, receiverId, message, roomId });

      await newMessage.save();

      socket.broadcast.to(roomId).emit('receiveMessage', newMessage);
    });

    // Handle WebRTC signaling

    socket.on('offer', (offer, roomId) => {
      console.log('Received offer:', offer);
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
      console.log('Received answer:', answer);
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('candidate', (candidate, roomId) => {
      console.log('Received candidate:', candidate);
      socket.to(roomId).emit('candidate', candidate);
    });


    socket.on("disconnect", () => {
      for (const room in rooms) {
        rooms[room] = rooms[room].filter((user) => user.userId !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
          delete broadcasters[room];
        } else if (broadcasters[room] === socket.id) {
          delete broadcasters[room];
        }
      }
    });
  });


}

function getRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}