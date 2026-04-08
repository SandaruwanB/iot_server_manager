const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');
const dashboardControllerFactory = require('../app/controllers/dashboardController');
const userControllerFactory = require('../app/controllers/userController');
const settingsControllerFactory = require('../app/controllers/settingsController');
const climateMonitorControllerFactory = require('../app/controllers/climateMonitorController');
const { webAuth, webNotAuth } = require('../app/middlewares/authMiddleware');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView, getOtpVerificationView, getChangePasswordView, performLogin } = authControllerFactory(broadcast);
    const { getDashboardView } = dashboardControllerFactory(broadcast);
    const { getUserListView, getUserCreateView } = userControllerFactory(broadcast);
    const { getSettingsView } = settingsControllerFactory(broadcast);
    const { getClimateView } = climateMonitorControllerFactory(broadcast);

    route.get('/login', webNotAuth, getLoginView);
    route.post('/login', performLogin);

    route.get('/password/reset', webNotAuth, getResetPasswordView);
    route.get('/otp/verify', webNotAuth, getOtpVerificationView);
    route.get('/password/change', webNotAuth, getChangePasswordView);

    route.get('/dashboard', webAuth, getDashboardView);

    route.get('/users', webAuth, getUserListView);
    route.get('/users/create', webAuth, getUserCreateView);

    route.get('/settings', webAuth, getSettingsView);

    route.get('/climate', webAuth, getClimateView);

    return route;
}