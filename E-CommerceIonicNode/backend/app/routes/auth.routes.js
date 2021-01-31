module.exports = app => {
  const { authJwt, verifySignUp } = require("../middleware");
  const controller = require("../controllers/auth.controller");

  var router = require("express").Router();

  // app.use(function (req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  router.post(
    "/signup",
    
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    controller.signup
  );

  router.post("/signin", controller.signin);

  router.get("/:id", [authJwt.verifyToken], controller.findOne);

  router.get("/:username", [authJwt.verifyToken], controller.findOneByUserName);

  router.get("/email/compare/:email", controller.compareUsersEmail);

  router.get("/username/compare/:username", controller.compareUserName);

  router.get("/users/update/compare/username/:username/:id",[authJwt.verifyToken], controller.compareUserNameWithOtherUsers);
  
  router.get("/users/update/compare/email/:email/:id",[authJwt.verifyToken], controller.compareEmailWithOtherUsers);

  router.put("/:id", [authJwt.verifyToken], controller.update);

  app.use('/api/auth', router);

}

