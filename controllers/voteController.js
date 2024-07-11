const prisma = require("../prismaClient");
const jwt = require("jsonwebtoken");

exports.createVote = async (req, res) => {
  const { candidateId } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { userId } = jwt.verify(token, process.env.SECRET_KEY);
  try {
    // Check if the user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: { userId },
    });

    if (existingVote) {
      return res.status(400).json({ error: "You have already voted." });
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId,
        candidateId,
        voteTime: new Date(),
      },
    });

    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    // Fetch all candidates
    const candidates = await prisma.candidate.findMany({
      include: {
        user: true,
      },
    });

    // Fetch votes and group by candidateId
    const voteResults = await prisma.vote.groupBy({
      by: ["candidateId"],
      _count: {
        candidateId: true,
      },
    });

    // Fetch total voters
    const totalVoters = await prisma.user.count({
      where: {
        role: "STUDENT",
      },
    });

    // Fetch used votes
    const usedVotes = await prisma.vote.count();

    // Map vote counts to candidates
    const results = candidates.map((candidate) => {
      const voteCount = voteResults.find(
        (vote) => vote.candidateId === candidate.id
      );
      return {
        candidateId: candidate.id,
        candidateName: candidate.user.name,
        position: candidate.position,
        votes: voteCount ? voteCount._count.candidateId : 0,
      };
    });

    res.status(200).json({
      totalVoters,
      usedVotes,
      candidates: results,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
