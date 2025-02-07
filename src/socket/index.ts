import { io, Socket } from 'socket.io-client';

const socketConnection = (): Socket => {
  const socket: Socket = io('http://192.168.0.101:8082');
  return socket;
};

export default socketConnection;
