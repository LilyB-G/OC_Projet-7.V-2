module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
  },
    {
    tableName: "User"
  });

  // User.associate = (models) => {
  //   User.hasMany(models.Post, {
  //     foreignKey: "UserId",
  //     onDelete: "cascade",
  //   });
  // };

    User.associate = (models) => {
      User.hasMany(models.Comment, {
        foreignKey: {
          allowNull: false
        },
        onDelete: "cascade",
      });
  };

  return User;
};
