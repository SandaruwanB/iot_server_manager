const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetMail } = require('../app/controllers/mailController');
const { authenticateDevice } = require('../app/middleware/auth');
const Users = require('../app/models/users');

const route = require('express').Router();


module.exports = (broadcast) => {
    route.post('/login', async (req, res) => {
        const { username, password, remember } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        try {
            const user = await Users.findOne({ where: { user_name: String(username) } });
            if (!user || !user.password) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const valid = await bcrypt.compare(String(password), user.password);
            if (!valid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const expiresIn = remember ? '30d' : '24h';
            const token = jwt.sign(
                { id: user.id, username: user.user_name },
                process.env.JWT_SECRET,
                { expiresIn }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
            });
            return res.json({ redirect: '/' });
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

    route.post('/mail', sendPasswordResetMail);

    route.get('/hello', (req, res) => {
        res.json({ message: 'Hello, World!' });
    });

    route.post('/broadcast', authenticateDevice, (req, res) => {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'message field is required and must be a string' });
        }
        if (message.length > 1000) {
            return res.status(400).json({ error: 'message too long' });
        }
        broadcast({ type: 'info', message });
        res.json({ ok: true, sent: message });
    });

    route.post('/dht22', authenticateDevice, (req, res) => {
        const { temperature, humidity } = req.body;
        if (typeof temperature !== 'number' || typeof humidity !== 'number') {
            return res.status(400).json({ error: 'temperature and humidity fields must be numbers' });
        }
        if (!isFinite(temperature) || !isFinite(humidity)) {
            return res.status(400).json({ error: 'temperature and humidity must be finite numbers' });
        }
        if (temperature < -80 || temperature > 150) {
            return res.status(400).json({ error: 'temperature out of valid range (-80 to 150)' });
        }
        if (humidity < 0 || humidity > 100) {
            return res.status(400).json({ error: 'humidity out of valid range (0 to 100)' });
        }
        broadcast({ type: 'dht22', data: { temperature, humidity } });
        res.json({ ok: true, received: { temperature, humidity } });
    });

    return route;
};