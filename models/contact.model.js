const mongoose = require("mongoose");

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    contact_name: String,
    phone: String,
  })
);

module.exports = Contact;
