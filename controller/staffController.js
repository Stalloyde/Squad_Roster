const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const Staff = require('../models/staff');
const Sport = require('../models/sport');

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

exports.newStaffGET = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./staff/new-staff', { sports });
});

exports.newStaffPOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sport').trim().escape(),
  body('designation').trim().escape(),
  body('bio').trim().escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const sports = await Sport.find();
    const newStaff = new Staff({
      firstName: capitalise(req.body.firstName),
      lastName: capitalise(req.body.lastName),
      sport: req.body.sport,
      designation: req.body.designation,
      bio: capitalise(req.body.bio),
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./staff/new-staff', { sports, staff: newStaff, errors: errors.array() });
    } else {
      const duplicateCheck = await Staff.find(
        {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          sport: newStaff.sport.name,
        },
      );

      if (duplicateCheck.length > 0) {
        res.render('./staff/new-staff', {
          sports, staff: newStaff, errors: errors.array(), duplicateError: `'${newStaff.fullName}' already exists`,
        });
      } else {
        await newStaff.save();
        res.redirect(newStaff.url);
      }
    }
  }),
];
