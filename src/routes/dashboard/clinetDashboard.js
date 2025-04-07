const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: "Client Dashboard API is working" });
});

module.exports = router;
