module.exports = (broadcast) => {
    return {
        getUserListView: (req, res) => {
            res.render('users');
        }
    }
}