const asoToken = (sequelize, DataTypes) => {
    const AsoToken = sequelize.define(
      "bx3_asoToken",
      {
        token: DataTypes.STRING,
        email: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
      },
      {
        timestamps: true
      }
    );
  
    AsoToken.associate = models => {
        AsoToken.belongsTo(models.Client, { foreignKey: "bx3ClientId" });
    };
  
    return AsoToken;
  };
  
  export default asoToken;