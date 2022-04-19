// Cross Origin Resource Sharing
const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500", // localhost public ip
  "http://localhost:3500",
];

const corsOptions = {
  // origin parameter is whoever requested (ex: google.com)
  origin: (origin, callback) => {
    // if the domain is in the whitelist
    // '!origin' equiv to 'undefined', necessary b/c localhost doesn't serve an origin REMOVE AFTER DEVELOPMENT
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // callback(error, origin_sent_back?)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
