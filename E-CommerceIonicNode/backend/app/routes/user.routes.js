module.exports = app => {
  const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

var router = require("express").Router();

  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  router.get("/all", controller.allAccess);

  app.get(
    "/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  router.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  router.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.use('/api/user', router);
};
