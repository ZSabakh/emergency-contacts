const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyContact = require("./verifyContact");
const limitRate = require("./limitRate");

module.exports = {
  authJwt,
  verifySignUp,
  verifyContact,
  limitRate,
};
