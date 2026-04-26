import { io } from "socket.io-client";


let socketInstance = null;


export const initializeSocket = () => {

    socketInstance = io(import.meta.env.VITE_API_BASE_URL,{
        auth: {
            token: localStorage.getItem("token")
        }
    });

    return socketInstance;
}