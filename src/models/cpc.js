const cpc = (sequelize, DataTypes) => {
  const Cpc = sequelize.define(
    "bx3_cpc",
    {
      code: DataTypes.STRING,
      docRef: DataTypes.STRING

    },
    {
      timestamps: false
    }
  );

  Cpc.associate = models => {
    Cpc.belongsTo(models.Patent, { foreignKey: "bx3PatentId" });
  };



  return Cpc;
};

export default cpc;
