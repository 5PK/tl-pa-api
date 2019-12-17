var uuidv4 = require("uuid/v4")
var asoToken = require("./asoToken")

const client = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "bx3_client",
    {
      name: DataTypes.STRING,
      aso: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      primaryContact: DataTypes.STRING
    },
    {
      timestamps: true
    }
  );

  Client.associate = models => {
    Client.belongsTo(models.User, { foreignKey: "bx3UserId" });
    Client.hasMany(models.Alert, { onDelete: 'CASCADE' }, { foreignKey: 'bx3ClientId' });
    Client.hasMany(models.AsoToken, { onDelete: 'CASCADE' }, { foreignKey: 'bx3ClientId' });
  };

  Client.createAsoToken = async () => {

    let token = await asoToken.create({
      token: uuidv4,
      email: req.body.aso,
      isActive: false,
    });

    console.log(token);

    return token;
  };

  return Client;
};

module.exports = client
