import reactUseWebSocket, { Options } from 'react-use-websocket';
import { getToken } from '../utils/authenticationHelper';

const protocol = 'ws'
const hostname = 'localhost'
const port = 8000
const basePath = 'ws'

export enum WebSocketPath {
    MODEL_CHANGES = 'model_changes'
}

export function useWebSocket(options: Options, path: WebSocketPath) {
    return reactUseWebSocket(
        encodeURI(`${protocol}://${hostname}:${port}/${basePath}/${path}/?token=${getToken()}`),
        options
    )
}
