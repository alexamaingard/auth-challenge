const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "thisIsASecretKey";

const hashPassword = async (password) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  if (salt) {
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Generated hashed password:", hashedPassword);

    if (!hashedPassword) {
      return res
        .status(500)
        .json({ error: "Hashing the provided password failed." });
    }
    return hashedPassword;
  }
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const createdUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  if (!createdUser) {
    return res.status(500).json({ error: "Failed to create user." });
  }

  res.json({ data: createdUser });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordsMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, jwtSecret);

  res.json({ data: token });
};

module.exports = {
  registerUser,
  loginUser,
};