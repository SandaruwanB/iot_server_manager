const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');
const dashboardControllerFactory = require('../app/controllers/dashboardController');
const userControllerFactory = require('../app/controllers/userController');
const { webAuth, webNotAuth } = require('../app/middlewares/authMiddleware');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView, getOtpVerificationView, getChangePasswordView, performLogin } = authControllerFactory(broadcast);
    const { getDashboardView } = dashboardControllerFactory(broadcast);
    const { getUserListView } = userControllerFactory(broadcast);

    route.get('/login', webNotAuth, getLoginView);
    route.post('/login', performLogin);

    route.get('/password/reset', webNotAuth, getResetPasswordView);
    route.get('/otp/verify', webNotAuth, getOtpVerificationView);
    route.get('/password/change', webNotAuth, getChangePasswordView);

    route.get('/dashboard', webAuth, getDashboardView);

    route.get('/users', webAuth, getUserListView);

    return route;
}