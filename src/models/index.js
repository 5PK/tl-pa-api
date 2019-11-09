import sequelize from '../config/dbConfig'

const models = {
  User: sequelize.import('./user'),
  Client: sequelize.import('./client'),
  Token: sequelize.import('./token'),
  Alert: sequelize.import('./alert'),
  Contact: sequelize.import('./contact')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;