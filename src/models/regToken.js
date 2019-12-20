const regToken = (sequelize, DataTypes) => {
  const RegToken = sequelize.define(
    "bx3_regToken",
    {
      token: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN
    },
    {
      timestamps: true
    }
  );

  RegToken.associate = models => {
    RegToken.belongsTo(models.User, { foreignKey: "bx3UserId" });
  };

  return RegToken;
};

module.exports = regToken;
