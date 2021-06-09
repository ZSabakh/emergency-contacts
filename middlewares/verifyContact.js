const db = require("../models");
const Contact = db.contact;

verifyName = (req, res, next) => {
  let name = req.body.contact_name;
  if (!name || name.length > 50) {
    res.status(400).send({
      message: "Contact name invalid.",
    });
    return;
  }
  next();
};

checkDuplicate = (req, res, next) => {
  Contact.find(
    {
      contact_name: req.body.contact_name,
      phone: req.body.phone,
      user_id: req.userId,
    },
    (err, contacts) => {
      if (contacts) {
        res
          .status(200)
          .send({ message: "You have already submitted this contact" });
        return;
      } else if (err) {
        console.log(err);
      } else {
        next();
      }
    }
  );
};

verifyPhone = (req, res, next) => {
  let phone = req.body.phone;
  if (!phone || phone.length > 40) {
    res.status(400).send({
      message: "Phone number invalid.",
    });
    return;
  }
  next();
};

const verifyContact = {
  verifyName,
  verifyPhone,
  checkDuplicate,
};

module.exports = verifyContact;
