const db = require("../models");
const Contact = db.contact;

verifyName = (req, res, next) => {
  req.body.contacts.map((contact) => {
    let name = contact.contact_name;
    if (!name || name.length > 50) {
      res.status(400).send({
        message: "Contact name invalid.",
      });
      return;
    }
  });
  next();
};

checkDuplicate = (req, res, next) => {
  req.body.contacts.map((contact) => {
    Contact.find(
      {
        contact_name: contact.contact_name,
        phone: contact.phone,
        user_id: req.userId,
      },
      (err, contacts) => {
        if (contacts.length > 0) {
          res.status(200).send({ message: "You have already submitted this contact" });
          return;
        } else if (err) {
          console.log(err);
        }
      }
    );
  });
  next();
};

verifyPhone = (req, res, next) => {
  req.body.contacts.map((contact) => {
    let phone = contact.phone;
    if (!phone || phone.length > 40) {
      res.status(400).send({
        message: "Phone number invalid.",
      });
      return;
    }
  });
  next();
};

const verifyContact = {
  verifyName,
  verifyPhone,
  checkDuplicate,
};

module.exports = verifyContact;
