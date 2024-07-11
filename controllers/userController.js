const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { uploadImageToCloudinary } = require("../services/cloudinary");

const SECRET_KEY = process.env.SECRET_KEY;
const saltRounds = 10;

exports.createUser = async (req, res) => {
  const {
    name,
    email,
    password = "123",
    grade,
    dob,
    nisn,
    role,
    address,
  } = req.body;
  const photo = req.file;
  try {
    const photoUrl = await uploadImageToCloudinary(photo.path);
    console.log(photoUrl);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        grade,
        dob,
        nisn: parseInt(nisn),
        role,
        address,
        photo: photoUrl,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isUserVoted = await prisma.vote.findFirst({
      where: { userId: user.id },
    });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1d",
    });

    delete user.password;
    res
      .status(200)
      .json({ token, data: { ...user, isVoted: Boolean(isUserVoted) } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, name } = req.query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit, 10);

  try {
    const totalUsers = await prisma.user.count({
      where: { role: "STUDENT", name: { contains: name, mode: "insensitive" } },
    });
    const users = await prisma.user.findMany({
      skip,
      take,
      where: { role: "STUDENT", name: { contains: name, mode: "insensitive" } },
    });
    res.status(200).json({
      data: users,
      meta: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        candidacies: {
          none: {},
        },
      },
    });
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
