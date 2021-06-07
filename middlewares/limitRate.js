const rateLimit = require("express-rate-limit");

const limitRate = rateLimit({
  windowMs: 60 * 60 * 1000, //1 Hour
  max: 15,
  message: "Too many requests from client, please try again after an hour",
});

module.exports = limitRate;
