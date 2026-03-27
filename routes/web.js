const route = require('express').Router();

const { getLoginView } = require('../controllers/authController');



module.exports = (broadcast) => {
    route.get('/login', getLoginView);


    return route;
}