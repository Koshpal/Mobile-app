import { io, Socket } from 'socket.io-client';

const socketConnection = (): Socket => {
  const socket: Socket = io('http://172.22.100.198:8082');
  return socket;
};

export default socketConnection;
