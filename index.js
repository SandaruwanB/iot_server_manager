const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const path = require('path');
const dotnev = require('dotenv');


dotnev.config({path: path.join(__dirname, '.env')});

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'views/static')));

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

app.get('/', (req, res) => res.redirect('/web/login'));
app.use('/api', require('./routes/api')(broadcast));
app.use('/web', require('./routes/web')(broadcast));


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});