const jwt = require('jsonwebtoken');

const secret = process.env.APP_KEY;

// web auth middleware
const webAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect('/web/login');
    }

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch {
        res.clearCookie('token');
        return res.redirect('/web/login');
    }
};

// not auth routes protector
const webNotAuth = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        next()
    }
    try {
        req.user = jwt.verify(token, secret);
        return res.redirect('/web/dashboard');
    } catch {
        res.clearCookie('token');
        next();
    }
}


// api auth middleware
const apiAuth = (req, res, next) => {
    let token = req.cookies?.token;

    if (!token) {
        const header = req.headers['authorization'];
        if (header && header.startsWith('Bearer ')) {
            token = header.slice(7);
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { webAuth, webNotAuth, apiAuth };
