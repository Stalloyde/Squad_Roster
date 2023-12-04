const express = require('express');
const sportsController = require('../controller/sportsController');

const router = express.Router();

router.get('/', sportsController.sportsDirectory);
router.get('/create', sportsController.newSportGET);
router.post('/create', sportsController.newSportPOST);
router.get('/:sportName', sportsController.sportDetails);

module.exports = router;
