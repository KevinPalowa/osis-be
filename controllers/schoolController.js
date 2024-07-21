const prisma = require("../prismaClient");

// Get all schools
const getAllSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single school by ID
const getSchoolById = async (req, res) => {
  const { id } = req.params;
  try {
    const school = await prisma.school.findUnique({
      where: { id: parseInt(id) },
    });
    if (school) {
      res.json(school);
    } else {
      res.status(404).json({ error: "School not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new school
const createSchool = async (req, res) => {
  const { name } = req.body;
  console.log(name);
  try {
    const newSchool = await prisma.school.create({
      data: { name },
    });
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a school by ID
const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    const updatedSchool = await prisma.school.update({
      where: { id: parseInt(id) },
      data: { name, address },
    });
    res.json(updatedSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a school by ID
const deleteSchool = async (req, res) => {
  const { id } = req.params;

  try {
    // Check for associations in User table
    const userCount = await prisma.user.count({
      where: { schoolId: parseInt(id) },
    });

    // Check for associations in Candidate table
    const candidateCount = await prisma.candidate.count({
      where: { schoolId: parseInt(id) },
    });

    // Check for associations in Vote table
    const voteCount = await prisma.vote.count({
      where: { schoolId: parseInt(id) },
    });

    if (userCount > 0 || candidateCount > 0 || voteCount > 0) {
      return res.status(400).json({
        error: "Cannot delete school. It is associated with other records.",
      });
    }

    // If no associations, proceed to delete the school
    await prisma.school.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "School deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the school." });
  }
};

module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
};
