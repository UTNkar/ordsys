let protocol: string;
let hostname: string;
let port: number;
const basePath = 'admin/ws';

if (process.env.NODE_ENV === 'production') {
  protocol = 'wss';
  hostname = 'ordsys.utn.se';
  port = 443;
} else {
  protocol = 'ws';
  hostname = 'localhost';
  port = 3000;
}

export function createWebsocket() {
  return new WebSocket(encodeURI(`${protocol}://${hostname}:${port}/${basePath}/model_changes/`));
}
