const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.post(
    "/admin/add-general-text",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addGeneralText
  );
};
