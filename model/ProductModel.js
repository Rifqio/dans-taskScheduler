const { Sequelize, DataTypes } = require("sequelize");
const { mainDB, backupDB } = require("../config/database");

const Product = mainDB.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const ProductBackup = backupDB.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Product, ProductBackup };
