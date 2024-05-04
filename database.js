// Database connection
const { Sequelize, DataTypes } = require("sequelize");

// Create a Sequelize instance with database credentials
const sequelize = new Sequelize("usersdb", "root", "database", {
  host: "localhost",
  dialect: "mysql",
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Data Model
const User = sequelize.define(
  "userstable",
  {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true, // Specify auto-increment for Id column
    },
    Username: Sequelize.STRING(100),
    Email: {
      type: Sequelize.STRING(255),
      unique: true, // Specifying 'Email' as a unique column
    },
    Password: Sequelize.STRING(255),
  },
  {
    tableName: "userstable", // Explicitly defining the table name without pluralization
    timestamps: false, // Disable timestamps
  }
);

// Check if methods like findOne and findByPk exist on the User model
// console.log('findOne method exists:', typeof User.findOne === 'function');
// console.log('findByPk method exists:', typeof User.findByPk === 'function');

sequelize
  .sync()
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to sync models:", err);
  });

console.log("database.js: User model exported:", User);
module.exports = { sequelize, User };

// Check if database is connected correctly, and the website can access the database
// User.describe().then((attributes) => {
//   console.log(attributes);
// }).catch((err) => {
//   console.error('Error getting model attributes:', err);
// });
