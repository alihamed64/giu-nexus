require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connection");

const app = express();

// simple test route
app.get("/", (req, res) => {
  res.send("GIU Nexus backend is running");
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();