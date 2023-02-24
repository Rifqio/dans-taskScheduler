const { Sequelize } = require("sequelize");

const mainDB = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  database: "api_task_scheduler",
  username: "root",
  password: "",
});

const backupDB = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  database: "api_task_scheduler_backup",
  username: "root",
  password: "",
});

module.exports = { mainDB, backupDB };
