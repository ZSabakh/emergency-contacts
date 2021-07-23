const fetch = require("node-fetch");

const getPhoneCode = async (countryCode) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`, requestOptions)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .then((result) => {
      return result.callingCodes[0];
    })
    .catch((error) => console.log("error", error));
};

module.exports = getPhoneCode;
