const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView, getOtpVerificationView } = authControllerFactory(broadcast);

    route.get('/login', getLoginView);
    route.get('/password/reset', getResetPasswordView);
    route.get('/otp/verify', getOtpVerificationView);

    return route;
}