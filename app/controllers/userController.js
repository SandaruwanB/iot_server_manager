const Users = require('../models/users');
const { Op } = require('sequelize');

module.exports = (broadcast) => {
    return {
        getUserListView: async (req, res) => {
            return getUserList(req, res);
        }
    };
};


const getUserList = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const search = (req.query.search || '').trim();
    const offset = (page - 1) * limit;

    const where = search ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { user_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ],
        id: { [Op.ne]: req.user.id }
    } : {
        id: { [Op.ne]: req.user.id }
    };

    const { count, rows: users } = await Users.findAndCountAll({
        where,
        limit,
        offset,
        order: [['id', 'ASC']],
        attributes: ['id', 'name', 'user_name', 'email', 'is_superuser', 'created_at']
    });

    res.render('users', {
        users,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        },
        search
    });
}