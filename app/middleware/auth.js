const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function authenticateJWT(req, res, next) {
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function authenticateDevice(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const expected = process.env.DEVICE_API_KEY;
    if (!apiKey || !expected) {
        return res.status(401).json({ message: 'Invalid API key' });
    }
    try {
        const a = Buffer.from(apiKey);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return res.status(401).json({ message: 'Invalid API key' });
        }
    } catch {
        return res.status(401).json({ message: 'Invalid API key' });
    }
    next();
}

module.exports = { authenticateJWT, authenticateDevice };
