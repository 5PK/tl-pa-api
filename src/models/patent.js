const patent = (sequelize, DataTypes) => {
  const Patent = sequelize.define(
    "bx3_patent",
    {
      docRef: DataTypes.STRING,
      title: DataTypes.TEXT,
      abstract: DataTypes.TEXT("long"),
      inventors: DataTypes.JSON,
      applicants: DataTypes.JSON,
      assignees: DataTypes.JSON,
      claims: DataTypes.TEXT("long"),
      descDraw: DataTypes.TEXT("long")
    },
    {
      timestamps: false
    }
  );

  Patent.associate = models => {
    Patent.hasMany(
      models.Cpc,
      { onDelete: "CASCADE" },
      { foreignKey: "bx3PatentId" }
    );
  };

  return Patent;
};

module.exports = patent;
