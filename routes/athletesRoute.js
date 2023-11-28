const express = require('express');
const athletesController = require('../controller/athletesController');

const router = express.Router();

router.get('/', athletesController.athletesDirectory);

module.exports = router;
