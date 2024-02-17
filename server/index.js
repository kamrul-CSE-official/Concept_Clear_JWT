const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const privateData = require("./db.json");

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log("from verify: ", token);
  if (!token) {
    return res.status(401).send({ message: "not authorized" });
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "not authorized" });
    }
    console.log("Decoded: ", decoded);
    req.user = decoded;
    next();
  });
};

// Routes
app.get("/", (req, res) => {
  console.log("Token from client:", req.cookies.token);
  res.send({ message: "Learn JWT." });
});

app.get("/private", verifyToken, async (req, res) => {
  console.log("provate: ", req.user);
  res.send({ message: "success", status: 200, data: privateData });
});

app.get("/userDetails/:email", verifyToken, async (req, res) => {
  const requestEmail = req.params.email;
  const tokenEmail = req.user.email;
  console.log(tokenEmail);
  if (requestEmail !== tokenEmail) {
    return res.status(403).send({ message: "Fordiden User" });
  }

  const userData = privateData.users.find(
    (user) => user.email === requestEmail
  );

  if (userData) {
    res.status(200).send({ message: "success", status: 200, data: userData });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
  
  

// Authentication route
app.post("/jwt", (req, res) => {
  const user = req.body;
  const secret = process.env.ACCESS_TOKEN_SECRET;
  // In practice, you should validate the user credentials here
  // For simplicity, let's assume the user is authenticated
  const token = jwt.sign(user, secret, {
    expiresIn: "1h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // Ensure secure for production
      sameSite: "none", // For cross-site requests
      maxAge: 3600000,
    })
    .send({ success: true });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
