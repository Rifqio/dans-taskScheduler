const schedule = require("node-schedule");
const { Product, ProductBackup } = require("../model/ProductModel");
const amqp = require("amqplib");
const amqpUrl = "amqp://localhost:5672";

exports.GetProducts = async (req, res) => {
  try {
    const data = await Product.findAll();
    return res.json(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.AddProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const data = await Product.create({ name, price });
    try {
      const connection = await amqp.connect(amqpUrl);
      const channel = connection.createChannel();
      (await channel).assertQueue("product.created");
      (await channel).sendToQueue(
        "product.created",
        Buffer.from(JSON.stringify(data))
      );
    } catch (error) {
      console.log(error.message);
    }
    return res.status(201).json({ message: "Product added", data });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const prodId = await Product.findByPk(id);
    const data = await prodId.update({ name, price });
    try {
      const connection = await amqp.connect(amqpUrl);
      const channel = connection.createChannel();
      (await channel).assertQueue("product.updated");
      (await channel).sendToQueue(
        "product.updated",
        Buffer.from(JSON.stringify(data))
      );
    } catch (error) {
      console.log(error.message);
    }
    return res.json({ message: "Product updated" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
