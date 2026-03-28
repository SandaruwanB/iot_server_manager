const { sequelize } = require('../../database/connection');
const { DataTypes } = require('sequelize');


const ServerStatus = sequelize.define('server_status', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    is_online: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ServerStatus;