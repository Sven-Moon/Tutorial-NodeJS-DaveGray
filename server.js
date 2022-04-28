const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// MIDDLEWARE
// custom middleware logger
app.use(logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requiement
app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// .use() applies middleware to all incoming routes
// this handles form data
app.use(express.urlencoded({ extended: false }));
// handles NOT form json data
app.use(express.json());
// middleware for cookies
app.use(cookieParser());

// serve static files (such as css)
app.use(express.static(path.join(__dirname, "./public")));
// adds the static files usage when in the subdir route
app.use("/subdir", express.static(path.join(__dirname, "./public")));

// ROUTES
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/subdir", require("./routes/subdir"));
// All routes below will use verifyJWT
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

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

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
