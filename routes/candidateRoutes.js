const express = require("express");
const candidateController = require("../controllers/candidateController");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

router.get("/candidates", authenticateJWT, candidateController.getCandidates);
router.get(
  "/candidates/:id",
  authenticateJWT,
  candidateController.getCandidate
);
router.post("/candidate", authenticateJWT, candidateController.addCandidate);

router.delete(
  "/candidates/:id",
  authenticateJWT,
  candidateController.deleteCandidate
);

module.exports = router;
