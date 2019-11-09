const contact = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
      "bx3_contact",
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
  
    Contact.associate = models => {
        Contact.belongsTo(models.Client, { foreignKey: "bx3ClientId" });
    };
  
    return Contact;
  };
  
  export default contact;