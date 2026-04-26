import { Socket } from "socket.io-client";


let socketInstance = null;


export const getSocketInstance = () => {

    socketInstance = socket(imoprt.meta.env.VITE_API_BASE_URL,{
        auth: {
            token: localStorage.getItem("token")
        }
    });

    return socketInstance;

}

export const recieveMessage = (eventNmae, cb) => {
    socketInstance.on(eventNmae, cb);
}


export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}