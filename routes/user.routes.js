const { authJwt, checkContact } = require("../middlewares");
const { verifyContact } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/public", controller.allAccess);

  app.get("/user", [authJwt.verifyToken], controller.userBoard);
  app.get("/user/get-contacts", [authJwt.verifyToken], controller.getContacts);
  app.post("/user/add-contact", [authJwt.verifyToken, verifyContact.verifyName, verifyContact.verifyPhone, verifyContact.checkDuplicate], controller.addContact);
  app.post("/user/remove-contacts", [authJwt.verifyToken], controller.removeContacts);
  app.post("/user/send-text", [authJwt.verifyToken], controller.sendText);
};
