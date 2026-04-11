const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');
const dashboardControllerFactory = require('../app/controllers/dashboardController');
const userControllerFactory = require('../app/controllers/userController');
const settingsControllerFactory = require('../app/controllers/settingsController');
const climateMonitorControllerFactory = require('../app/controllers/climateMonitorController');
const serverStatusControllerFactory = require('../app/controllers/serverStatusController');
const { webAuth, webNotAuth } = require('../app/middlewares/authMiddleware');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView, getOtpVerificationView, getChangePasswordView, performLogin, performLogout } = authControllerFactory(broadcast);
    const { getDashboardView } = dashboardControllerFactory(broadcast);
    const { getUserListView, getUserCreateView, getUserEditView } = userControllerFactory(broadcast);
    const { getSettingsView } = settingsControllerFactory(broadcast);
    const { getClimateView } = climateMonitorControllerFactory(broadcast);
    const { getServerStatusView } = serverStatusControllerFactory(broadcast);

    route.get('/login', webNotAuth, getLoginView);
    route.get('/logout', webAuth, performLogout);
    route.post('/login', performLogin);

    route.get('/password/reset', webNotAuth, getResetPasswordView);
    route.get('/otp/verify', webNotAuth, getOtpVerificationView);
    route.get('/password/change', webNotAuth, getChangePasswordView);

    route.get('/dashboard', webAuth, getDashboardView);

    route.get('/users', webAuth, getUserListView);
    route.get('/users/create', webAuth, getUserCreateView);
    route.get('/users/view/:id', webAuth, getUserEditView);

    route.get('/settings', webAuth, getSettingsView);

    route.get('/climate', webAuth, getClimateView);

    route.get('/server/status', webAuth, getServerStatusView);

    return route;
}