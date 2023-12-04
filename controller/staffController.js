const express = require('express');
const asyncHandler = require('express-async-handler');
const capitalise = require('./capitalise');
const Staff = require('../models/staff');

exports.staffDirectory = asyncHandler(async (req, res, next) => {
  const staffList = await Staff.find()
    .populate('sport')
    .sort({ lastName: 1 });
  res.render('./staff/staff', { staffList });
});

exports.staffDetails = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findOne({ _id: req.params.staffId })
    .populate('sport')
    .sort({ lastName: 1 });
  res.render('./staff/staff-details', { staff });
});
