// const mysql = require('mysql')
// const pool  = mysql.createPool({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: '14151415',
//     database: 'techlink-1'
// })

import Sequelize from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'mysql',
    },
  );

module.exports = sequelize