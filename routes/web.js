const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');
const dashboardControllerFactory = require('../app/controllers/dashboardController');
const { webAuth } = require('../app/middlewares/authMiddleware');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView, getOtpVerificationView, getChangePasswordView, performLogin } = authControllerFactory(broadcast);
    const { getDashboardView } = dashboardControllerFactory(broadcast);

    route.get('/login', getLoginView);
    route.post('/login', performLogin);

    route.get('/password/reset', getResetPasswordView);
    route.get('/otp/verify', getOtpVerificationView);
    route.get('/password/change', getChangePasswordView);

    route.get('/dashboard', webAuth, getDashboardView);

    return route;
}