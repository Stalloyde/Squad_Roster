const express = require('express');
const athletesController = require('../controller/athletesController');

const router = express.Router();

router.get('/', athletesController.athletesDirectory);
router.get('/:id', athletesController.athleteDetails);

module.exports = router;
