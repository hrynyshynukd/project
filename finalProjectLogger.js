const express = require("express");
const app = express();

app.use(express.json());

const db = [];

app.get("/log", (req, res) => {
  res.send("Welcome to log");
});

app.post("/personal-log", (req, res) => {
  let userData = req.body;

  if (Object.keys(userData).length === 0) {
    userData = generateSampleUserData();
  }

  db.push(userData);
  res.status(200).send("User log saved");
});

function generateSampleUserData() {
  const deviceIds = ["device001", "device002", "device003", "device004"];
  const categories = ["login", "view", "submit", "logout"];
  const descriptions = [
    "User logged in",
    "User viewed a page",
    "User submitted a form",
    "User logged out",
  ];

  const timeSeed = new Date().getSeconds();
  const timestamp = new Date().toISOString();

  return {
    time: timestamp,
    deviceId: deviceIds[timeSeed % deviceIds.length],
    category: categories[timeSeed % categories.length],
    description: descriptions[timeSeed % descriptions.length],
  };
}

app.listen(3000, () => {
  console.log("Stream activated");
});
