const express = require("express");
const userController = require("../controllers/userController");
const authenticateJWT = require("../middleware/auth");
const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post(
  "/users",
  authenticateJWT,
  upload.single("photo"),
  userController.createUser
);
router.post("/login", userController.login);
router.get("/users/all", authenticateJWT, userController.getAllUsers);
router.get("/users/:id", authenticateJWT, userController.getUser);
router.get("/users", authenticateJWT, userController.getUsers);

module.exports = router;
