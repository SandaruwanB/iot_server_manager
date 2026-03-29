const bcrypt = require('bcrypt');
const Users = require('../app/models/users');

const seedUsers = async () => {
    const users = [
        {
            user_name: 'admin',
            name: 'Administrator',
            email: 'sandarusbandara110@gmail.com',
            password: await bcrypt.hash('admin@1234', 10),
            last_password_reset: null
        }
    ];

    for (const user of users) {
        await Users.findOrCreate({
            where: { user_name: user.user_name },
            defaults: user
        });
    }

    console.log('[SEEDER] Users seeded');
};

module.exports = { seedUsers };
