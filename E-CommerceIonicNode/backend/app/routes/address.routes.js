module.exports = app => {
    const address = require("../controllers/address.controller.js");
    const { authJwt } = require("../middleware");

    var router = require("express").Router();
    
    
    router.post("/", address.create);

    router.get("/", address.findAll);

    router.get("/:id", address.findOne);

    router.put("/:id", [authJwt.verifyToken], address.update);

    router.delete("/:id", [authJwt.verifyToken], address.delete);
    
    app.use('/api/address', router);
    }