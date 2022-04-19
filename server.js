const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3500;

// MIDDLEWARE
// cusom middleware logger
app.use(logger);

app.use(cors(corsOptions));

// .use() applies middleware to all incoming routes
// this handles form data
app.use(express.urlencoded({ extended: false }));
// handles NOT form json data
app.use(express.json());

// serve static files (such as css)
app.use(express.static(path.join(__dirname, "./public")));
// adds the static files usage when in the subdir route
app.use("/subdir", express.static(path.join(__dirname, "./public")));

// ROUTE HANDLERS
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
