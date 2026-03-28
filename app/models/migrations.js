const { sequelize } = require('../../database/connection');
const { DataTypes } = require('sequelize'); 


const MigrationRecord = sequelize.define('migrations', {
    model_name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    checksum: {
        type: DataTypes.STRING(32),
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MigrationRecord;