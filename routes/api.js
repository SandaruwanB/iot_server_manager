const { sendPasswordResetMail } = require('../app/controllers/mailController');

const route = require('express').Router();


module.exports = (broadcast) => {
    // route.get('/', (req, res) => {
    //     res.render('index');
    // });

    route.post('/mail', sendPasswordResetMail);

    route.get('/hello', (req, res) => {
        res.json({ message: 'Hello, World!' });
    });

    route.post('/broadcast', (req, res) => {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'message field is required' });
        }
        broadcast({ type: 'info', message });
        res.json({ ok: true, sent: message });
    });

    route.post('/dht22', (req, res) => {
        const { temperature, humidity } = req.body;
        if (typeof temperature !== 'number' || typeof humidity !== 'number') {
            return res.status(400).json({ error: 'temperature and humidity fields must be numbers' });
        }
        broadcast({ type: 'dht22', data: { temperature, humidity } });
        res.json({ ok: true, received: { temperature, humidity } });
    });

    route.post('/sensor-data', (req, res) => {
        const { dht22_temp, dht22_humidity, ds18b20 } = req.body;
        if (typeof dht22_temp !== 'number' || typeof dht22_humidity !== 'number') {
            return res.status(400).json({ error: 'dht22_temp and dht22_humidity must be numbers' });
        }
        if (!Array.isArray(ds18b20) || ds18b20.length !== 4 || !ds18b20.every(v => typeof v === 'number')) {
            return res.status(400).json({ error: 'ds18b20 must be an array of exactly 4 numbers' });
        }
        broadcast({ type: 'sensor_data', data: { dht22_temp, dht22_humidity, ds18b20 } });
        res.json({ ok: true });
    });

    route.post('/server-status', (req, res) => {
        const { online } = req.body;
        if (typeof online !== 'boolean') {
            return res.status(400).json({ error: 'online must be a boolean' });
        }
        broadcast({ type: 'server_status', data: { online } });
        res.json({ ok: true });
    });

    return route;
};