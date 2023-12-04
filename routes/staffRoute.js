const express = require('express');
const staffController = require('../controller/staffController');

const router = express.Router();

/* GET users listing. */
router.get('/', staffController.staffDirectory);
router.get('/create', staffController.newStaffGET);
router.post('/create', staffController.newStaffPOST);
router.get('/:staffId', staffController.staffDetails);

module.exports = router;
