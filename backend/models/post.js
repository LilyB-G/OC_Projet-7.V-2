module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },  
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
      {
      tableName: "Post"
      });

  //     Post.associate = (models) => {
  //       Post.belongsTo(models.User, {
  //         foreignKey: {
  //           allowNull: false,
  //         },
  //       });
  // };
  
    Post.associate = (models) => {
      Post.hasMany(models.Comment, {
        foreignKey: {
          allowNull: false
        },
        onDelete: "cascade",
        });
      };

    return Post;
  };
  