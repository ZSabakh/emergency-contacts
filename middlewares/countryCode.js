let IPinfo = require("node-ipinfo");
let getPhoneCode = require("../utility/getPhoneCode");

const countryCode = async (req, res, next) => {
  let ipinfo = new IPinfo(process.env.IP_INFO_TOKEN);
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7);
  }
  for (let [index, contact] of req.body.contacts.entries()) {
    let phone = contact.phone;
    if (phone.charAt(0) != "+") {
      await ipinfo.lookupIp(ip).then(async (response) => {
        if (response.countryCode) {
          await getPhoneCode(response.countryCode).then((phoneCode) => {
            req.body.contacts[index].phone = "+" + phoneCode + phone;
          });
        }
      });
    }
  }
  next();
};

module.exports = countryCode;
