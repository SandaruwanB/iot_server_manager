const { sequelize } = require('../../database/connection');
const { DataTypes } = require('sequelize');


const TempAndHumidity = sequelize.define('temp_and_humidity', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dht22_temp: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dht22_humidity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ds18b20_temp_00: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ds18b20_temp_01: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ds18b20_temp_02: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ds18b20_temp_03: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


module.exports = TempAndHumidity;