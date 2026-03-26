const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function broadcast(data) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({ type: 'info', message: 'Connected to WebSocket server' }));

    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw);
            console.log('Received:', data);
            broadcast({ type: 'message', data });
        } catch {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

app.use('/api', require('./routes/api')(broadcast));

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});