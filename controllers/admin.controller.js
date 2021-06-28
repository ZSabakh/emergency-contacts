const { mongoose } = require("../models");
const db = require("../models");
const User = db.user;
const GeneralText = db.general_text;

exports.addGeneralText = (req, res) => {
  new GeneralText({
    text: req.body.text,
    user_id: "ADMIN",
  }).save((err) => {
    res.status(200).send({ message: "Saved successfully" });
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};
