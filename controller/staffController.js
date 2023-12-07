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
  const staff = await Staff.findOne({ _id: req.params.id })
    .populate('sport')
    .sort({ lastName: 1 });
  res.render('./staff/staff-details', { staff });
});

exports.newStaffGET = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./staff/staff-form', { sports });
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
    let newStaff;
    const sports = await Sport.find();
    if (req.file) {
      newStaff = new Staff({
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },
        firstName: capitalise(req.body.firstName),
        lastName: capitalise(req.body.lastName),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      });
    } else {
      newStaff = new Staff({
        image: {
          fieldname: null,
          originalname: null,
          encoding: null,
          mimetype: null,
          destination: null,
          filename: null,
          path: null,
          size: null,
        },
        firstName: capitalise(req.body.firstName),
        lastName: capitalise(req.body.lastName),
        sport: req.body.sport,
        designation: capitalise(req.body.designation),
        bio: capitalise(req.body.bio),
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-form', { sports, staff: newStaff, errors: errors.array() });
    } else {
      const duplicateCheck = await Staff.find(
        {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          sport: newStaff.sport.name,
        },
      );

      if (duplicateCheck.length > 0) {
        res.render('./staff/staff-form', {
          sports, staff: newStaff, errors: errors.array(), duplicateError: `'${newStaff.fullName}' already exists`,
        });
      } else {
        await newStaff.save();
        res.redirect(newStaff.url);
      }
    }
  }),
];

exports.editStaffGET = asyncHandler(async (req, res, next) => {
  const [[staff], sports] = await Promise.all(
    [Staff.find({ _id: req.params.id }).populate('sport'),
      Sport.find().sort({ name: 1 }),
    ],
  );
  res.render('./staff/staff-form', { staff, sports, title: `Edit Staff Particulars- ${staff.fullName}` });
});

exports.editStaffPOST = [
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  body('sport').trim().escape(),
  body('designation').trim().escape(),
  body('bio').trim().escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const [[staff], sports] = await Promise.all(
      [Staff.find({ _id: req.params.id }),
        Sport.find().sort({ name: 1 }),
      ],
    );
    const newStaff = new Staff({
      id: req.params.id,
      firstName: capitalise(req.body.firstName),
      lastName: capitalise(req.body.lastName),
      sport: req.body.sport,
      designation: capitalise(req.body.designation),
      bio: capitalise(req.body.bio),
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-form', {
        sports, staff: newStaff, errors: errors.array(), title: `Edit Staff Particulars- ${staff.fullName}`,
      });
    } else {
      const duplicateCheck = await Staff.find(
        {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          sport: newStaff.sport.name,
        },
      );

      if (duplicateCheck.length > 0) {
        res.render('./staff/staff-form', {
          sports,
          staff: newStaff,
          errors: errors.array(),
          duplicateError: `'${newStaff.fullName}' already exists`,
          title: `Edit Staff Particulars- ${newStaff.fullName}`,
        });
      } else {
        await Staff.findByIdAndUpdate(req.params.id, newStaff);
        res.redirect(newStaff.url);
      }
    }
  }),
];

exports.changeStaffPicGET = asyncHandler(async (req, res, next) => {
  const targetStaff = await Staff.findById(req.params.id);
  res.render('./staff/staff-change-pic', { staff: targetStaff, title: `Change Picture - ${targetStaff.fullName}` });
});

exports.changeStaffPicPOST = [
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    let newStaff;
    if (req.file) {
      newStaff = new Staff({
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },
        id: req.params.id,
      });
    } else {
      newStaff = new Staff({
        image: {
          fieldname: null,
          originalname: null,
          encoding: null,
          mimetype: null,
          destination: null,
          filename: null,
          path: null,
          size: null,
        },
        id: req.params.id,
      });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const targetStaff = await Staff.findById(req.params.id);
      res.render('./staff/Staff-change-pic', {
        staff: newStaff, errors: errors.array(), title: `Change Picture - ${targetStaff.fullName}`,
      });
    } else {
      const updatedStaff = await Staff.findOneAndUpdate({ _id: req.params.id }, newStaff);
      res.redirect(updatedStaff.url);
    }
  }),
];

exports.deleteStaffGET = asyncHandler(async (req, res, next) => {
  const targetStaff = await Staff.findById(req.params.id);
  res.render('./staff/staff-delete', { staff: targetStaff });
});

exports.deleteStaffPOST = [
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const targetSport = await Staff.findById(req.params.id);

    if (!errors.isEmpty()) {
      res.render('./staff/staff-delete', { staff: targetSport, errors: errors.array() });
    } else {
      await Staff.findByIdAndDelete(req.params.id);
      res.redirect('/staff');
    }
  }),
];
