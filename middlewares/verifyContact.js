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

checkDuplicate = async (req, res, next) => {
  const contacts = req.body.contacts;
  for (let contact of contacts) {
    let found,
      conditions = {
        contact_name: contact.contact_name,
        phone: contact.phone,
        user_id: req.userId,
      };

    try {
      found = await Contact.findOne(conditions).lean().exec();
    } catch (err) {
      console.log(err);
    }

    if (found) {
      res.status(500).send({ message: "You have already submitted this contact" });
      return;
    }
  }

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
