const express = require("express");
const app = express();
const amqp = require("amqplib");
const schedule = require("node-schedule");
const { ProductBackup } = require("../model/ProductModel");
const { backupDB } = require("../config/database");
const amqpUrl = "amqp://localhost:5672";

async function database() {
  await backupDB.authenticate();
  console.log("Backup database connected");
}

async function productCreated() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = connection.createChannel();
    (await channel).assertQueue("product.created");
    (await channel).consume("product.created", async (data) => {
      console.log("Received data from product.created queue");
      (await channel).ack(data);
      const product = JSON.parse(data.content);
      //   const product = JSON.parse(string);
      schedule.scheduleJob(
        { start: Date.now(), rule: "*/5 * * * *" },
        async function () {
          await ProductBackup.create({
            id: product.id,
            name: product.name,
            price: product.price,
          });
        }
      );
      console.log(product);
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function productUpdated() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = connection.createChannel();
    (await channel).assertQueue("product.updated");
    (await channel).consume("product.updated", async (data) => {
      console.log("Received data from product.updated queue");
      (await channel).ack(data);
      const product = JSON.parse(data.content);
      schedule.scheduleJob(
        { start: Date.now(), rule: "*/5 * * * *" },
        async function () {
          await ProductBackup.findByPk(id).then(async (data) => {
            data.update({ name: product.name, price: product.price });
          });
        }
      );
      console.log(product);
    });
  } catch (error) {
    console.log(error.message);
  }
}


database();
productCreated();
productUpdated();

app.listen(5001, () => console.log("Product backup is listening on port 5001"));
