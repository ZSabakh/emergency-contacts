const mongoose = require("mongoose");

const UserText = mongoose.model(
  "user_text",
  new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    text: String,
  })
);

module.exports = UserText;
