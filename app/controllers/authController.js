const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (broadcast) => {
    return {
        getLoginView: (req, res) => {
            res.render('auth/login');
        },

        getResetPasswordView: (req, res) => {
            res.render('auth/passwordReset');
        },

        getOtpVerificationView: (req, res) => {
            res.render('auth/otpVerify');
        },

        getChangePasswordView: (req, res) => {
            res.render('auth/changePassword');
        },

        performLogin: async (req, res) => {
            return login(req, res, broadcast);
        }

    };
}

const login = async (req, res, broadcast) => {
    console.log('Login attempt:', req.body);

    const { username, password, remember } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const user = await Users.findOne({ where: { user_name: username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const isMatch = await validatePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const expiresIn = remember ? '30d' : '1d';
        const token = jwt.sign(
            { id: user.id, user_name: user.user_name, name: user.name, email: user.email },
            process.env.APP_KEY,
            { expiresIn }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: 'Login successful', redirect: '/web/dashboard' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}



const validatePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
}