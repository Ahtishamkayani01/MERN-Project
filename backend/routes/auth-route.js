const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const validate = require("../middlewares/validate-middleware");
const { signupSchema } = require("../validators/auth-validator");
router.route("/").get(authControllers.home);
router
  .route("/register")
  .post(validate(signupSchema), authControllers.register);
router.route("/login").post(authControllers.login);

module.exports = router;
