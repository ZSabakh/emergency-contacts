const { mongoose } = require("../models");
const db = require("../models");
const Contact = db.contact;
const Message = db.message;
const User = db.user;
const GeneralText = db.general_text;
const UserText = db.user_text;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

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
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({
      contact_name: req.body.contact_name,
      phone: req.body.phone,
      user_id: mongoose.Types.ObjectId(req.userId),
    });
  });
};

exports.addText = (req, res) => {
  let customUserText = req.body.text;
  new UserText({
    user_id: mongoose.Types.ObjectId(req.userId),
    text: customUserText,
  }).save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({
      message: "Text saved successfully",
    });
  });
};

exports.getTexts = (req, res) => {
  GeneralText.find({}, (adminErr, adminTexts) => {
    UserText.find({ user_id: mongoose.Types.ObjectId(req.userId) }, (userErr, userTexts) => {
      if (userErr || adminErr) {
        res.status(500).send({ message: userErr });
        return;
      }
      res.status(200).send({ texts: adminTexts.concat(userTexts) });
    });
  });
};

exports.removeContacts = (req, res) => {
  contactIDs = req.body._id;
  contactIDs.map((contactID) => {
    Contact.deleteOne({ _id: contactID, user_id: mongoose.Types.ObjectId(req.userId) }, (err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send(result);
    });
  });
};

exports.getContacts = (req, res) => {
  Contact.find({ user_id: mongoose.Types.ObjectId(req.userId) }, (err, contacts) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    res.status(200).send({
      contacts: contacts,
    });
  });
};

exports.sendText = (req, res) => {
  let phoneData = [];
  let userPhone;
  let userName;
  let location = req.body.location ? `https://www.google.com/maps/place/${req.body.location[0]}+${req.body.location[1]}/` : null;
  let message;
  const queries = req.body.phone.map(async (number) => {
    await User.findOne({ _id: mongoose.Types.ObjectId(req.userId) }, (err, user) => {
      userPhone = user.phone;
      userName = user.username;
    });

    if (req.body.general_text_id) {
      await GeneralText.findOne({ _id: req.body.general_text_id }, (err, textMessage) => {
        message = `SOS SENT FROM ${userPhone} with username ${userName}\n\nTEXT: ${textMessage.text}\n\n ${req.body.location ? `LOCATION: ${location}` : ""}`;
      });
    } else {
      message = `SOS SENT FROM ${userPhone} with username ${userName}\n\nTEXT: ${req.body.text}\n\n ${req.body.location ? `LOCATION: ${location}` : ""}`;
    }
    client.messages.create({
      body: message,
      from: "+19707103180",
      to: number,
    });

    //Find the recepient in all contacts to save in database.
    await Contact.findOne({ phone: number, user_id: mongoose.Types.ObjectId(req.userId) }, (err, contact) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (contact) {
        phoneData.push({ number: number, contact: contact.contact_name });
      } else {
        phoneData.push({ number: number, contact: "unknown" });
      }
    });
  });

  return Promise.all(queries).then(() => {
    new Message({
      user_id: mongoose.Types.ObjectId(req.userId),
      phone: phoneData,
      text: message,
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
