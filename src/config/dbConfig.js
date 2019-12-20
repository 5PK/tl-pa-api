var Sequelize = require("sequelize")

const isProduction = process.env.NODE_ENV === "production";

var connectionString;
if (isProduction == true) {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
} else {
  connectionString = `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DB_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`;
}

const sequelize = new Sequelize(
  isProduction ? process.env.DATABASE_URL : connectionString,
  {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;