const contact = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
      "bx3_contact",
      {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING
      },
      {
        timestamps: true
      }
    );
  
    Contact.associate = models => {
        Contact.belongsTo(models.Client, { foreignKey: "bx3ClientId" });
    };
  
    return Contact;
  };
  
  export default contact;