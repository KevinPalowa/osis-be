const express = require("express");
const voteController = require("../controllers/voteController");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

router.post("/votes", authenticateJWT, voteController.createVote);
router.get("/results", authenticateJWT, voteController.getResults);

module.exports = router;
