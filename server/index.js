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

// Function to generate refresh token
function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "50h" });
}

// Function to generate access token
function generateAccessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
}

// Middleware to verify refresh token
const verifyRefreshToken = (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(403).json({ error: "Not authorized" });
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Not authorized" });
    }
    req.user = decoded;
    next();
  });
};

// Middleware to verify access token
const verifyAccessToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(403).json({ error: "Authorization header is missing" });
  }
  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res
      .status(403)
      .json({ error: "Invalid authorization header format" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err?.message === "jwt expired") {
      const newAccessToken = generateAccessToken({
        email: "riya@gmail.com",
        password: "123456",
      });
      return res
        .status(401)
        .json({ error: "Access token expired", newAccessToken });
    } else if (err) {
      return res.status(403).json({ error: "Invalid access token" });
    }
    next();
  });
};

// Routes
app.get("/", (req, res) => {
  res.send({ message: "Learn JWT." });
});

app.get("/private", verifyRefreshToken, async (req, res) => {
  res.send({ message: "Success", status: 200, data: privateData });
});

app.get("/userDetails/:email", verifyRefreshToken, async (req, res) => {
  const requestEmail = req.params.email;
  const tokenEmail = req.user.email;
  if (requestEmail !== tokenEmail) {
    return res.status(403).json({ error: "Forbidden User" });
  }
  const userData = privateData.users.find(
    (user) => user.email === requestEmail
  );
  if (userData) {
    res.status(200).json({ message: "Success", status: 200, data: userData });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Authentication route
app.post("/jwt", async (req, res) => {
  const user = await req.body;
  const token = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);
  res
    .cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    })
    .json({
      success: true,
      message: "Successfully logged in",
      accessToken,
    });
});

app.post("/info", verifyRefreshToken, verifyAccessToken, async (req, res) => {
  const data = {
    cookie: req.cookies.refreshToken.substring(0, 5),
    accessToken: req.headers.authorization.substring(0, 5),
    data: req.body,
  };
  res.status(200).json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
