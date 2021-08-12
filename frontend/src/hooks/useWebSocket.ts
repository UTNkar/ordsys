import reactUseWebSocket, { Options } from 'react-use-websocket';

let protocol = "";
let hostname = "";
let port = 0;
let basePath = "admin/ws";

if (process.env.NODE_ENV === 'production') {
    protocol = "wss";
    hostname = 'ordsys.utn.se';
    port = 443;
} else {
    protocol = "ws";
    hostname = 'localhost';
    port = 3000;
}


export enum WebSocketPath {
    MODEL_CHANGES = 'model_changes'
}

export function useWebSocket(options: Options, path: WebSocketPath) {
    return reactUseWebSocket(
        encodeURI(`${protocol}://${hostname}:${port}/${basePath}/${path}/`),
        options
    )
}
