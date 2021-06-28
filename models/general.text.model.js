const mongoose = require("mongoose");

const GeneralText = mongoose.model(
  "general_text",
  new mongoose.Schema({
    user_id: String,
    text: String,
  })
);

module.exports = GeneralText;
