const { logAction, verifySignUp, limitRate } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  app.use("/auth", logAction);

  app.post("/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted, limitRate], controller.signup);

  app.post("/auth/signin", [limitRate], controller.signin);
};
