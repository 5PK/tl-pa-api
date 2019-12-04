const models = require('../models');
import sequelize from '../config/dbConfig'


const truncateTable = (modelName) =>
    models[modelName].destroy({
        where: {},
        force: true,
    });

module.exports = async function truncate(model) {
    if (model) {
        return truncateTable(model);
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true }); //<---- Do not check referential constraints
    return Promise.all(
        Object.keys(models).map((key) => {
            if (['sequelize', 'Sequelize'].includes(key)) return null;
            return truncateTable(key);
        })
    );
}

