// Cross Origin Resource Sharing
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  // origin parameter is whoever requested (ex: google.com)
  origin: (origin, callback) => {
    // if the domain is in the whitelist
    // '!origin' equiv to 'undefined', necessary b/c localhost doesn't serve an origin REMOVE AFTER DEVELOPMENT
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // callback(error, origin_sent_back?)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
