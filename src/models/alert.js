const alert = (sequelize, DataTypes) => {
    const Alert = sequelize.define(
      "bx3_alert",
      {
        name: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        query: DataTypes.TEXT,
        contacts: DataTypes.TEXT,
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