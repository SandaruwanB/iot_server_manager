const route = require('express').Router();
const authControllerFactory = require('../app/controllers/authController');

module.exports = (broadcast) => {
    const { getLoginView, getResetPasswordView } = authControllerFactory(broadcast);

    route.get('/login', getLoginView);
    route.get('/password/reset', getResetPasswordView);

    return route;
}