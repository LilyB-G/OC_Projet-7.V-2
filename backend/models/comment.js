module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
      content: {
        type: DataTypes.STRING,
        allowNull: true,
        },
        Like: {
          type: DataTypes.STRING,
          allowNull: true,
          },
        disLike: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        usersLiked: {
          type: DataTypes.STRING,
          allowNull: true,
        },
    }, {
        tableName: "Comment"
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
          foreignKey: "UserId",
          onDelete: "CASCADE",
        });
      };
    Comment.associate = (models) => {
        Comment.belongsTo(models.Post, {
            foreignKey: "PostId",
            onDelete: "CASCADE",
        });
      };
    return Comment;
  };
  