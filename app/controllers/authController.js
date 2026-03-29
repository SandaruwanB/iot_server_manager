module.exports = (broadcast) => {
    return {
        getLoginView: (req, res) => {
            res.render('auth/login');
        },

        getResetPasswordView: (req, res) => {
            res.render('auth/passwordReset');
        },

        getOtpConfirmationView: (req, res) => {
            res.render('auth/otpConfirmation');
        }
    };
};