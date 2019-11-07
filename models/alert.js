const alert = (sequelize, DataTypes) => {
    const Alert = sequelize.define(
      "bx3_alert",
      {
        name: DataTypes.STRING,
        contacts: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        query: DataTypes.STRING
      },
      {
        timestamps: true
      }
    );
  
    Alert.associate = models => {
        Alert.belongsTo(models.Client, { foreignKey: "bx3ClientId" });
    };
  
    return Alert;
  };
  
  export default alert;