const express = require("express");
const Log = require("../db/log.model");
const transformLogs = require("../common/logs.transformer");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    let whereClause = {};

    if (req.query.deviceId) {
      whereClause.deviceId = req.query.deviceId;
    }

    if (req.query.category) {
      whereClause.category = req.query.category;
    }

    if (req.query.description) {
      whereClause.description = {
        [Op.iLike]: `%${req.query.description}%`,
      };
    }

    if (req.query.fromDateTime && req.query.toDateTime) {
      const from = new Date(req.query.fromDateTime);
      const to = new Date(req.query.toDateTime);
      whereClause.date = {
        [Op.gte]: from,
        [Op.lte]: to,
      };
    }

    // ❗️Сортування тільки якщо обране поле та напрям
    let sortBy = req.query.sortBy;
    let sortOrder = req.query.sortOrder === "desc" ? "DESC" : req.query.sortOrder === "asc" ? "ASC" : null;

    const orderClause = (sortBy && sortOrder) ? [[sortBy, sortOrder]] : undefined;

    const logs = await Log.findAll({
      where: { ...whereClause },
      order: orderClause,
    });

    res.render("index", {
      title: "Logs",
      logs: transformLogs(logs),
      selectedFrom: req.query.fromDateTime,
      selectedTo: req.query.toDateTime,
      selectedDeviceId: req.query.deviceId,
      selectedCategory: req.query.category,
      selectedDescription: req.query.description,
      selectedSort: sortBy,
      selectedOrder: sortOrder ? sortOrder.toLowerCase() : "",
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.render("index", {
      title: "Logs",
      logs: [],
      error: error.message,
    });
  }
});

router.get("/create", async function (req, res, next) {
  try {
    res.render("create-log", { title: "Create Log" });
  } catch (error) {
    console.error("Error rendering create log page:", error);
    res.render("create-log", {
      title: "Create Log",
      error: error.message,
    });
  }
});

router.post("/create", async function (req, res, next) {
  const { date, deviceId, category, description } = req.body;

  try {
    await Log.create({ date, deviceId, category, description });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating log:", error);
    res.render("create-log", {
      title: "Create Log",
      error: error.message,
    });
  }
});

module.exports = router;
