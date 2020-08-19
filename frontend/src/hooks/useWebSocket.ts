import reactUseWebSocket, { Options } from 'react-use-websocket';

let protocol = "";
let hostname = "";
let port = 0;
const basePath = "ws";

if (process.env.NODE_ENV === 'production') {
    protocol = "wss";
    hostname = 'ordsysbackend.utn.se';
    port = 443;
} else {
    protocol = "ws";
    hostname = 'localhost';
    port = 8000;
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
