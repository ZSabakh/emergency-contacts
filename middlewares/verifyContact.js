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
};

module.exports = verifyContact;
