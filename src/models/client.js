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
  };

  return Client;
};

export default client;
