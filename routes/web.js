const route = require('express').Router();

const { getLoginView, getResetPasswordView } = require('../app/controllers/authController');



module.exports = (broadcast) => {
    route.get('/login', getLoginView);
    route.get('/password/reset', getResetPasswordView);

    return route;
}