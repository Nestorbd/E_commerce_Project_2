module.exports = app => {
    const order = require("../controllers/order.controller.js");
    const { authJwt } = require("../middleware");
    
    var router = require("express").Router();
    
    
    router.post("/",[authJwt.verifyToken], order.create);

    router.get("/", [authJwt.verifyToken],order.findAll);
  
  
    router.put("/:id", [authJwt.verifyToken],order.update);
  
    router.delete("/:id",[authJwt.verifyToken], order.delete);
    
    app.use('/api/order', router);
    }