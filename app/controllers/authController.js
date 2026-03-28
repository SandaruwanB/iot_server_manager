module.exports.getLoginView = (req, res) => {
    res.render('auth/login');
}

module.exports.getResetPasswordView = (req, res) => {
    res.render('auth/passwordReset');
}