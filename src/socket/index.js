import io from 'socket.io-client';


const socketConnection=() => {
    const socket = io('http://192.168.0.101:8080');
    return socket
}

export default socketConnection