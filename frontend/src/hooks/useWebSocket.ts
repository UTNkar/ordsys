import reactUseWebSocket, { Options } from 'react-use-websocket';
import { getToken } from '../utils/authenticationHelper';

let protocol = "";
let hostname = "";
let port = 0;
let basePath = "";

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    protocol = "wss";
    hostname = 'ordsys.utn.se';
    port = 443;
    basePath = 'backend/ws';
} else {
    protocol = "ws";
    hostname = 'localhost';
    port = 8000;
    basePath = 'ws';
}


export enum WebSocketPath {
    MODEL_CHANGES = 'model_changes'
}

export function useWebSocket(options: Options, path: WebSocketPath) {
    return reactUseWebSocket(
        encodeURI(`${protocol}://${hostname}:${port}/${basePath}/${path}/?token=${getToken()}`),
        options
    )
}
