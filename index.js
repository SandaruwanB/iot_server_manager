const path = require('path');
const dotnev = require('dotenv');
dotnev.config({path: path.join(__dirname, '.env')});

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { WebSocketServer } = require('ws');
const { migrate } = require('./database/migrator');


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(cors({
    origin: (process.env.ALLOWED_ORIGINS || `http://localhost:${port}`).split(','),
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'views/static')));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts, please try again later' }
});

app.use(globalLimiter);
app.use('/api/login', loginLimiter);

function broadcast(data) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(payload);
        }
    });
}

wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
                return;
            }
            broadcast({ type: 'message', data });
        } catch {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
    });
});

app.get('/', (req, res) => res.redirect('/web/login'));
app.use('/api', require('./routes/api')(broadcast));
app.use('/web', require('./routes/web')(broadcast));

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

server.listen(port, async () => {
    if (process.env.DB_MIGRATE === 'true') await migrate();
    console.log(`Server is running on port ${port}`);
});