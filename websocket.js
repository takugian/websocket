const WebSocket = require('ws');

const server = new WebSocket.Server({
    port: 3000
});

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    let dataJson = JSON.parse(data);
    ws.send(`result: ${dataJson.value1 + dataJson.value2}`);
}

function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}

server.on('connection', onConnection);
console.log(`App Web Socket Server is running!`);