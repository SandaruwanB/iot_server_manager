module.exports = (broadcast) => {
    return {
        getDashboardView: (req, res) => {
            res.render('dashboard');
        }
    }
}