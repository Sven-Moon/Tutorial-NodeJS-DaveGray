const express = require("express");
const router = express.Router();
const empleesController = require("../../controllers/employeesController");

router
  .route("/")
  .get(empleesController.getAllEmployees)
  .post(empleesController.createNewEmployee)
  .put(empleesController.updateEmployee)
  .delete(empleesController.deleteEmployee);

// route with parameter(s)
router.route("/:id").get(empleesController.getEmployee);

module.exports = router;
