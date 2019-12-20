var sequelize = require("../config/dbConfig")

const models = {
  User: sequelize.import('./user'),
  Client: sequelize.import('./client'),
  Token: sequelize.import('./token'),
  Alert: sequelize.import('./alert'),
  Contact: sequelize.import('./contact'),
  AsoToken: sequelize.import('./asoToken'),
  Patent: sequelize.import('./patent'),
  Cpc: sequelize.import('./cpc'),
  RegToken: sequelize.import('./regToken')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = models;


