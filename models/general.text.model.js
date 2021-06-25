const mongoose = require("mongoose");

const GeneralText = mongoose.model(
  "general_text",
  new mongoose.Schema({
    text: String,
  })
);

module.exports = GeneralText;
