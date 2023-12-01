const express = require('express');
const asyncHandler = require('express-async-handler');
const Staff = require('../models/staff');

exports.staffDirectory = asyncHandler(async (req, res, next) => {
  const staffList = await Staff.find()
    .populate('sport')
    .sort({ lastName: 1 });
  res.render('./staff/staff', { staffList });
});
