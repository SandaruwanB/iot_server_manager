module.exports = (broadcast) => {
    return {
        getClimateView: async (req, res) => {
            res.render('climate');
        }
    };
};