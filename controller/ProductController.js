const schedule = require("node-schedule");
const { Product, ProductBackup } = require("../model/ProductModel");

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
    schedule.scheduleJob({ start: Date.now(), rule: "*/5 * * * *" }, async function () {
        await ProductBackup.create({ name, price });
      }
    );
    return res.status(201).json({ message: "Product added", data });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    await Product.findByPk(id).then(async (product) => {
      product.update({ name, price });
    });
    schedule.scheduleJob( { start: Date.now(), rule: "*/5 * * * *" }, async function () {
        await Product.findByPk(id).then(async (product) => {
          product.update({ name, price });
        });
      }
    );
    return res.json({ message: "Product updated" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    schedule.scheduleJob({ start: Date.now(), rule: "*/5 * * * *" }, async function () {
        await Product.destroy({ where: { id } });
    });
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
