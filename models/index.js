const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.contact = require("./contact.model");
db.message = require("./message.model");
db.general_text = require("./general.text.model");
db.user_text = require("./user.text.model");

db.ROLES = ["user", "admin"];

module.exports = db;
