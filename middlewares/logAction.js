const { mongoose } = require("../models");
const db = require("../models");
const Log = db.log;

const logAction = (req, res, next) => {
  const { password, ...requestData } = req.body;

  new Log({
    user_id: mongoose.Types.ObjectId(req.userId),
    route: req.url,
    data: requestData,
  }).save((err) => {});
  next();
};

module.exports = logAction;
