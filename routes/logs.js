const router = express.Router();
const Log = require("../db/log.model");

router.get("/", async function (req, res, next) {
  try {
    console.log(req.query);
    let whereClause = {};

    if (req.query.deviceId) {
      whereClause.deviceId = req.query.deviceId;
    }
    let sortBy = req.query.sortBy || "createdAt";
    let sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

    const logs = await Log.findAll({
      where: {
        ...whereClause,
      },
      order: [[sortBy, sortOrder]],
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  // res.send('respond with a resource');
});

router.post("/", async function (req, res, next) {
  const { date, deviceId, category, description } = req.body;

  try {
    const log = await Log.create({ date, deviceId, category, description });
    res.status(201).json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
