const route = require('express').Router();


module.exports = (brodcast) => {
    route.get('/login', (req, res) => {
        res.render('login');
    });

    return route;
}