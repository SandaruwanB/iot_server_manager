module.exports = (broadcast) => {
    return {
        getSettingsView: async (req, res) => {
            res.render('settings');
        }
    };
};