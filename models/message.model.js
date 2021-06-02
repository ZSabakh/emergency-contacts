const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    phone: [{ number: String, contact: String }],
    text: String,
  })
);

module.exports = Message;
