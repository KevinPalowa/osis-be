const prisma = require("../prismaClient");

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        user: true,
      },
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCandidate = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const candidates = await prisma.candidate.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.addCandidate = async (req, res) => {
  const { userId, visi, misi, biography } = req.body;
  try {
    const candidates = await prisma.candidate.create({
      data: { userId, visi, misi, biography },
    });
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Delete all votes associated with the candidate
    await prisma.vote.deleteMany({
      where: { candidateId: id },
    });

    // Delete the candidate
    await prisma.candidate.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Candidate and associated votes deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
