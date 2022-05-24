const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database");

const Posts = require("./Post");
const Reports = require("./Report");
const Comments = require("./Comment");

const Users = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: {
          args: 3,
          msg: "Le nom doit être au moins de 3 lettres.",
        },
        max: {
          args: 50,
          msg: "Le nom ne peut pas dépasser les 50 lettres.",
        },
        is: {
          args: /^([A-zàâçéèêëîïôûùüÿñæœ']+\s?)+\S/,
          msg: "Seulement sont accesptés les lettres et le character -",
        },
        notEmpty: true,
      },
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        min: {
          args: 3,
          msg: "Le prenom doit être au moins de 3 lettres.",
        },
        max: {
          args: 100,
          msg: "Le prenom ne peut pas dépasser les 100 characters.",
        },
        is: {
          args: /^([A-zàâçéèêëîïôûùüÿñæœ']+\s?)+\S/,
          msg: "Seulement sont accesptés les lettres et le character -",
        },
        notEmpty: true,
      },
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        min: 7,
        isEmail: {
          args: true,
          msg: "Le format doit être valide pour un email. Exemple: joedoe@mail.com",
        },
      },
      unique: "email",
    },
    password: {
      type: Sequelize.STRING(64),
      allowNull: false,
      is: /^[0-9a-f]{64}$/i,
    },
    profilePicture: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    coverPicture: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    bio: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
    isActive: {
      type: Sequelize.TINYINT,
      defaultValue: false,
    },
    role: {
      type: Sequelize.DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: {
          args: [["user", "admin"]],
          msg: "Le role doit être admin ou user.",
        },
      },
    }
  },
  { paranoid: true }
); // soft delete

// Friends
Users.belongsToMany(Users, {
  through: "follows",
  as: "idFollowing",
  onDelete: "CASCADE"
});
Users.belongsToMany(Users, {
  through: "follows",
  as: "idFollowed",
  onDelete: "CASCADE",
});

// 1 user per Post but a User can have many posts.
Users.hasMany(Posts)
Posts.belongsTo(Users);

// Like Posts
Users.belongsToMany(Posts, { through: "likes", onDelete: "CASCADE" });
Posts.belongsToMany(Users, { through: "likes", onDelete: "CASCADE" });

// 1 user per comment but a user can make many comments.
Users.hasMany(Comments);
Comments.belongsTo(Users);

// Like comments
Users.belongsToMany(Comments, {
  through: "likes",
  onDelete: "CASCADE",
});
// Like comments
Users.belongsToMany(Posts, {
  through: "likes",
  onDelete: "CASCADE",
});
Comments.belongsToMany(Users, {
  through: "likes",
  onDelete: "CASCADE",
});

// a reporta has 1 user but a lot of users can make a lot of reports
Users.hasMany(Reports);
Reports.belongsTo(Users);


module.exports = Users;
