module.exports = app => {
    const orderProduct = require("../controllers/orderProduct.controller.js");
    const { authJwt } = require("../middleware");

    var router = require("express").Router();
    
    
    router.post("/",[authJwt.verifyToken], orderProduct.create);

    router.get("/",[authJwt.verifyToken], orderProduct.findAll);
  
    router.get("/:id",[authJwt.verifyToken], orderProduct.findOne);
  
    router.put("/:id",[authJwt.verifyToken], orderProduct.update);
  
    router.delete("/:id",[authJwt.verifyToken], orderProduct.delete);
    
    app.use('/api/orderProduct', router);
    }