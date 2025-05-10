const express = require("express");
const Log = require("../db/log.model");
const transformLogs = require("../common/logs.transformer");
const {Op} = require("sequelize");
const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    let whereClause = {};

    if (req.query.deviceId) {
      whereClause.deviceId = req.query.deviceId;
    }

    //TODO add filters for other fields

    //TODO add default order to query, do not use order by in query
    let sortBy = req.query.sortBy || "createdAt";
    let sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

    if (req.query.description) {
      whereClause.description = {
        [Op.iLike]: `%${req.query.description}%`,
      };
    }

    const logs = await Log.findAll({
      where: {
        ...whereClause,
      },
      order: [[sortBy, sortOrder]],
    });

    res.render("index", {
      title: "Logs",
      logs: transformLogs(logs),
      selectedDate: req.query.date,
      selectedDeviceId: req.query.deviceId,
      selectedCategory: req.query.category,
      selectedDescription: req.query.description,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    //TODO add error on page
    res.render("??", { error: error.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { date, deviceId, category, description } = req.body;
    console.log({ date, deviceId, category, description });
    const params = new URLSearchParams({
      date,
      deviceId,
      category,
      description,
    });

    res.redirect(`/?${params}`);
  } catch (error) {
    console.error("Error fetching logs:", error);
    //TODO add error on page
    res.render("??", { error: error.message });
  }
});

router.get("/create", async function (req, res, next) {
  try {
    res.render("create-log", { title: "Create Log" });
  } catch (error) {
    console.error("Error rendering create log page:", error);
    //TODO add error on create log page
    res.render("??", { error: error.message });
  }
});

router.post("/create", async function (req, res, next) {
  const { date, deviceId, category, description } = req.body;

  try {
    const log = await Log.create({ date, deviceId, category, description });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating log:", error);
    //TODO add error on create log page
    res.render("??", { error: error.message });
  }
});

module.exports = router;
