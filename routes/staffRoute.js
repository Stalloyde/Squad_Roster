const express = require('express');
const staffController = require('../controller/staffController');

const router = express.Router();

/* GET users listing. */
router.get('/', staffController.staffDirectory);
router.get('/create', staffController.newStaffGET);
router.post('/create', staffController.newStaffPOST);
router.get('/:id', staffController.staffDetails);
router.get('/:id/edit', staffController.editStaffGET);
router.post('/:id/edit', staffController.editStaffPOST);
router.get('/:id/delete', staffController.deleteStaffGET);
router.post('/:id/delete', staffController.deleteStaffPOST);

module.exports = router;
