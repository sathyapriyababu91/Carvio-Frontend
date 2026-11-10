import { io } from "socket.io-client";
import { getToken } from "./authStorage";

const SOCKET_URL = "https://carvio-backend.onrender.com";

let socket = null;

export const connectSocket = async () => {
  try {
    const token = await getToken();

    if (!token) {
      console.log("SOCKET: No login token found");
      return null;
    }

    if (socket?.connected) {
      console.log("SOCKET: Already connected");
      return socket;
    }

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("SOCKET CONNECTION ERROR:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });

    return socket;
  } catch (error) {
    console.log("SOCKET ERROR:", error);
    return null;
  }
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
