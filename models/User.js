const user = (sequelize, DataTypes) => {
    const User = sequelize.define('bx3_user', {
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      firstName:{
        type: DataTypes.STRING,
        unique: false,
      },
      lastName:{
        type: DataTypes.STRING,
        unique: false,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        unique: false,
      },
      seed: {
        type: DataTypes.INTEGER,
        unique: false,
      }
    },
    {timestamps: true,});
  
    User.associate = models => {
      User.hasMany(models.Client, { onDelete: 'CASCADE' }, { foreignKey: 'bx3UserId' });
    };
  
    User.findByLogin = async login => {
      let user = await User.findOne({
        where: { email: login },
      });
  
      return user;
    };
  
    return User;
    
  };
  
  export default user;