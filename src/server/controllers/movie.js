const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "thisIsASecretKey";

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();

  if(!movies){
    return res.status(401).json({ error: "Couldn't get list of movies." });
  }

  res.json({ data: movies });
};

const createMovie = async (req, res) => {
  const { title, description } = req.body;
  const runtimeMins = parseInt(req.body.runtimeMins);
  const receivedToken = req.headers.authorization;

  if(!receivedToken){
    return res.status(401).json({ error: "No user token provided." });
  }

  try {
    const decodedToken = jwt.verify(receivedToken, jwtSecret);
  } 
  catch(error){
    return res.status(401).json({ error: "Invalid token provided." });
  }

  const createdMovie = await prisma.movie.create({
      data: {
          title: title,
          description: description,
          runtimeMins: runtimeMins
      }
  });

  if(!createdMovie){
    return res.status(401).json({ error: "Movie couldn't be created." });
  }

  res.json({ data: createdMovie });
};

module.exports = {
  getAllMovies,
  createMovie,
};
