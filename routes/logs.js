const express = require('express');
const router = express.Router();
const Log = require('../db/log.model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        const logs = await Log.findAll();
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  // res.send('respond with a resource');
});

router.post('/', async function(req, res, next) {
    const { date, deviceId, category, description } = req.body;

    try {
        const log = await Log.create({ date, deviceId, category, description });
        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
