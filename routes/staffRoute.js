const express = require('express');
const staffController = require('../controller/staffController');

const router = express.Router();

/* GET users listing. */
router.get('/', staffController.staffDirectory);

module.exports = router;
