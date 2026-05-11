require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const roastRoutes = require("./routes/roast");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/roast", roastRoutes);

app.get("/", (req, res) => res.json({ status: "Project Roaster API is live 🔥" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));