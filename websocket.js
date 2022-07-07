const WebSocket = require('ws');
const uuid = require('uuid');

const map = new Map();

const server = new WebSocket.Server({
    port: 3000,
    path: '/websockets',
});

function onMessage(ws, data) {

    console.log(`onMessage: ${data}`);

    let dataJson = JSON.parse(data);

    let wsTo = null;

    for (const [key, value] of map.entries()) {
        console.log('key', key);
        if (key == dataJson.userTo) {
            wsTo = value;
            break;
        }
    }

    if (wsTo == null) {
        ws.send("User invalid!");
    }

    server.clients.forEach(function each(client) {
        // if (client !== server && client.readyState === WebSocket.OPEN) {
        //     client.send("Thanks!");
        // }
        if (client == wsTo) {
            client.send(dataJson.message);
        }
    });

}

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

server.on('connection', function (ws, request) {

    const userId = uuid.v4();
    map.set(userId, ws);

    ws.on('message', data => onMessage(ws, data));

    ws.on('error', error => onError(ws, error));

    ws.on('close', function () {
        map.delete(userId);
        console.log(`onClose: WebSocket ${userId} has closed`);
    });

    console.log(`onConnection: WebSocket ${userId} has connected`);

});

console.log(`App WebSocket Server is running!`);