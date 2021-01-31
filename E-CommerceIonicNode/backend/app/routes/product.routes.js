module.exports = app => {
const product = require("../controllers/products.controller");
const { authJwt } = require("../middleware");

var router = require("express").Router();

router.post("/", [authJwt.verifyToken], product.create);

router.get("/", product.findAll);

router.get("/:id", product.findOne);

router.get("/name/compare/:name", product.compareProductName);

router.put("/:id",[authJwt.verifyToken], product.update);

router.delete("/:id",[authJwt.verifyToken], product.delete);

app.use('/api/product', router);
}