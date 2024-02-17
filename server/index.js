const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 5000;

// Routes
app.get("/", (req, res) => {
  console.log("Token from client:", req.cookies.token);
  res.send({ message: "Learn JWT." });
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
