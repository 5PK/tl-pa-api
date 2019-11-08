const token = (sequelize, DataTypes) => {
    const Token = sequelize.define(
      "bx3_token",
      {
        status:  DataTypes.STRING,
        token:  DataTypes.STRING
      },
      {
        timestamps: true
      }
    );
  
    Token.associate = models => {
        Token.belongsTo(models.User, { foreignKey: "userId" });
    };
  
    return Token;
  };
  
  export default token;
  
