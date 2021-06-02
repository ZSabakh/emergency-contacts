const { mongoose } = require("../models");
const Contact = require("../models/contact.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.addContact = (req, res) => {
  new Contact({
    contact_name: req.body.contact_name,
    phone: req.body.phone,
    user_id: mongoose.Types.ObjectId(req.userId),
  }).save((err) => {
    if (err) {
      console.log("error", err);
    }
  });

  res.status(200).send({
    name: req.body.contact_name,
    phone: req.body.phone,
    user_id: mongoose.Types.ObjectId(req.userId),
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
