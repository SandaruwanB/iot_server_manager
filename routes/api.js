const route = require('express').Router();


module.exports = (broadcast) => {
    // route.get('/', (req, res) => {
    //     res.render('index');
    // });

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

    return route;
};