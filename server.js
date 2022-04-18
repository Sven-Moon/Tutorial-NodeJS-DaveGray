const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// MIDDLEWARE
// cusom middleware logger
app.use(logger);
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
// leaving this open is fine for a public API
app.use(cors(corsOptions));

// .use() applies middleware to all incoming routes
// this handles form data
app.use(express.urlencoded({ extended: false }));
// handles NOT form json data
app.use(express.json());
// serve static files (such as css)
app.use(express.static(path.join(__dirname, "./public")));

// define routes
// ROOT
// regex evals to "/" or "/index.html" or "/index"
app.get("^/$|/index(.html)?", (req, res) => {
  // method 1 (preferred)
  res.sendFile(path.join(__dirname, "views", "index.html"));
  // method 2
  // res.sendFile("./views/index.html", { root: __dirname });
});
// new-page
app.get("/new-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
// old-page redirect
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // 302 by default
});

// ROUTE HANDLERS
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  // the 'next' handler is triggered on next()
  (req, res) => {
    res.send("Hey you");
  }
);

const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res, next) => {
  console.log("three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

// app.use('/')
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("text").send("404 Not found");
  }
});

// default 404, note the status() chain
// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// after everything else (except app.listen)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
