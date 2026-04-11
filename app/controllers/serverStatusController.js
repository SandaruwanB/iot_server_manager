module.exports = (broadcast) => {
    return {
        getServerStatusView: (req, res) => {
            res.render('server_status');
        }
    }
}