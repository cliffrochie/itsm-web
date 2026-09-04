import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(env.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const connectSocket = (userId?: number | string): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  if (userId) {
    const numId = Number(userId);
    if (!Number.isNaN(numId)) {
      s.emit('join:user', numId);
    }
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};
