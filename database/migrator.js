const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const MigrationRecord = require('../app/models/migrations');


function modelChecksum(model) {
    const attrs = JSON.stringify(model.rawAttributes, (key, value) => {
        if (typeof value === 'function') return value.toString();
        return value;
    });
    return crypto.createHash('md5').update(attrs).digest('hex');
}

async function migrate() {
    await MigrationRecord.sync({ force: false });

    const modelsDir = path.join(__dirname, '../app/models');
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js') && f !== 'migrations.js');

    for (const file of files) {
        const model = require(path.join(modelsDir, file));
        const modelName = model.getTableName ? model.getTableName() : model.name;
        const checksum = modelChecksum(model);

        const record = await MigrationRecord.findOne({ where: { model_name: modelName } });

        if (!record) {
            console.log(`[migrator] NEW -> ${modelName}`);
            await model.sync({ force: false });
            await MigrationRecord.create({ model_name: modelName, checksum });
        } else if (record.checksum !== checksum) {
            console.log(`[migrator] ALTER -> ${modelName}`);
            await model.sync({ alter: true });
            await record.update({ checksum });
        } else {
            console.log(`[migrator] SKIP -> ${modelName} (no changes)`);
        }
    }

    console.log(`[migrator] Completed`);
}

module.exports = { migrate };



