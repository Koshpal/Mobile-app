import { io, Socket } from "socket.io-client";

const socketConnection = (): Socket => {
  const socket: Socket = io("http://192.168.197.74:8080");
  return socket;
};

export default socketConnection;
