const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    route: String,
    data: Object,
  })
);

module.exports = Log;
