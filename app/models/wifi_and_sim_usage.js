const { sequelize } = require('../../database/connection');
const { DataTypes } = require('sequelize');


const WifiAndSimUsage = sequelize.define('wifi_and_sim_usage', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    is_use_wifi: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    is_use_sim: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = WifiAndSimUsage;