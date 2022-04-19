const express = require("express");
const router = express.Router();
const data = {};
// we're using the local data/employees.json as a data source
// but this would usually be a database
data.employees = require("../../data/employees.json");

router
  .route("/")
  // the below DOES NOT show how to set up an api,
  // it shows how to handle the routing for an API by
  // chaining the request methods together
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    // paraemeters are access within the reqest body
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .put((req, res) => {
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .delete((req, res) => {
    res.json({ id: req.body.id });
  });

// route with parameter(s)
router.route("/:id").get((req, res) => {
  res.json({ id: req.params.id });
});

module.exports = router;
