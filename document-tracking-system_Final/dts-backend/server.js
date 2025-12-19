import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import docsRoutes from "./routes/docs.js";
import analyticsRoutes from "./routes/analytics.js";


dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/docs", docsRoutes);
app.use("/api/analytics", analyticsRoutes);


// Register
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
      username,
      hashed,
      role || "user",
    ]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});


// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }


    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);


    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }


    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);


    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


// Protected route example
app.get("/api/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}!` });
});


// JWT Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}


const PORT = process.env.PORT || 5000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
