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
    contact_name: req.body.contact_name,
    phone: req.body.phone,
    user_id: mongoose.Types.ObjectId(req.userId),
  });
};

exports.removeContacts = (req, res) => {
  if (req.body.contact_ids.length < 1) {
    res.status(400).send({ message: "Invalid request" });
  }

  contactIDs = req.body.contact_ids;
  contactIDs.map((contactID) => {
    Contact.findByIdAndRemove(contactID, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.status(200).send(result);
      }
    });
  });
};

exports.getContacts = (req, res) => {
  Contact.find(
    { user_id: mongoose.Types.ObjectId(req.userId) },
    (err, contacts) => {
      res.status(200).send({
        contacts: contacts,
      });
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }
    }
  );
};

exports.sendText = (req, res) => {
  let phoneData = [];
  let userPhone;
  let userName;
  let location = `https://www.google.com/maps/place/${req.body.location[0]}+${req.body.location[1]}/`;
  const queries = req.body.phone.map(async (number) => {
    await User.findOne(
      { _id: mongoose.Types.ObjectId(req.userId) },
      (err, user) => {
        userPhone = user.phone;
        userName = user.username;
      }
    );
    client.messages.create({
      body: `SOS SENT FROM ${userPhone} with username ${userName}\n\nTEXT: ${
        req.body.text
      }\n\n ${req.body.location ? `LOCATION: ${location}` : ""}`,
      from: "+19707103180",
      to: number,
    });
    console.log(req.body.location);
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
      text: `SOS SENT FROM ${userPhone} with username ${userName}\n\nTEXT: ${
        req.body.text
      }\n\n ${req.body.location ? `LOCATION: ${location}` : ""}`,
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
