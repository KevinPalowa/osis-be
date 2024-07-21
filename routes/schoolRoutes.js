const express = require("express");
const {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} = require("../controllers/schoolController");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

router.get("/schools", getAllSchools);
router.get("/schools/:id", getSchoolById);
router.post("/schools", createSchool);
router.put("/schools/:id", updateSchool);
router.delete("/schools/:id", deleteSchool);

module.exports = router;
