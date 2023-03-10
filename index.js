const express = require("express");
const { mainDB } = require("./config/database");
const ProductRoute = require('./routes/ProductRoute')
const app = express();
app.use(express.json());

const database = async () => {
  try {
    await mainDB.authenticate();
    console.log("Main database connected");
  } catch (error) {
    console.log(error);
  }
};
database();
app.use('/product', ProductRoute)
app.listen(5000, () => console.log("listening on http://localhost:5000"));
