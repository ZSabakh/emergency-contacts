const { mongoose } = require("../models");
const db = require("../models");
const Contact = db.contact;
const Message = db.message;
const User = db.user;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.addContact = (req, res) => {
  new Contact({
    contact_name: req.body.contact_name,
    phone: req.body.phone,
    user_id: mongoose.Types.ObjectId(req.userId),
  }).save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  res.status(200).send({
    name: req.body.contact_name,
    phone: req.body.phone,
    user_id: mongoose.Types.ObjectId(req.userId),
  });
};

exports.sendText = (req, res) => {
  let phoneData = [];
  let userPhone;
  let userName;
  const queries = req.body.phone.map(async (number) => {
    await User.findOne(
      { _id: mongoose.Types.ObjectId(req.userId) },
      (err, user) => {
        userPhone = user.phone;
        userName = user.username;
      }
    );
    client.messages.create({
      body: `SOS SENT FROM ${userPhone} with username ${userName}\n\nTEXT: ${req.body.text}\n\n LIVE LOCATION:`,
      from: "+19707103180",
      to: number,
    });

    await Contact.findOne(
      { phone: number, user_id: mongoose.Types.ObjectId(req.userId) },
      (err, contact) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (contact) {
          phoneData.push({ number: number, contact: contact.contact_name });
        } else {
          phoneData.push({ number: number, contact: "unknown" });
        }
      }
    );
  });

  return Promise.all(queries).then(() => {
    new Message({
      user_id: mongoose.Types.ObjectId(req.userId),
      phone: phoneData,
      text: `SOS SENT FROM ${userPhone},TEXT: ${req.body.text}, LIVE LOCATION:`,
    }).save((err) => {
      if (err) {
        res.status(500).send({
          phone_data: phoneData,
          text: err,
        });
        return;
      }
    });

    res.status(200).send({
      phone_data: phoneData,
      text: req.body.text,
    });
  });
};
