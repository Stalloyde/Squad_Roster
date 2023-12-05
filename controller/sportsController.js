require('dotenv').config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const Sport = require('../models/sport');
const Athlete = require('../models/athlete');
const Staff = require('../models/staff');

exports.sportsDirectory = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./sports/sports', { sports });
});

exports.sportDetails = asyncHandler(async (req, res, next) => {
  const targetSport = req.params.id;
  const [[sport], athletes, staffList] = await Promise.all(
    [
      Sport.find({ _id: targetSport }),
      Athlete.find().populate('sport'),
      Staff.find().populate('sport'),
    ],
  );
  const sportAthletes = athletes.filter((athlete) => athlete.sport.name === sport.name)
    .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
  const sportStaff = staffList.filter((staff) => staff.sport.name === sport.name)
    .sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
  res.render('./sports/sport-details', { sport, athletes: sportAthletes, staffList: sportStaff });
});

exports.newSportGET = asyncHandler(async (req, res, next) => {
  const sports = await Sport.find().sort({ name: 1 });
  res.render('./sports/sport-form', { sports });
});

exports.newSportPOST = [
  body('sportName').trim().escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const sportName = capitalise(req.body.sportName);

    const newSport = new Sport({ name: sportName });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('./sports/sport-form', { sport: newSport, errors: errors.array() });
    } else {
      const duplicateCheck = await Sport.find({ name: newSport.name });
      if (duplicateCheck.length > 0) {
        res.render('./sports/sport-form', { sport: newSport, errors: errors.array(), duplicateError: `'${newSport.name}' already exists` });
      } else {
        await newSport.save();
        res.redirect(newSport.url);
      }
    }
  }),
];

exports.editSportGET = asyncHandler(async (req, res, next) => {
  const [targetSport] = await Sport.find({ _id: req.params.id });
  res.render('./sports/sport-form', { sport: targetSport, title: `Edit Sport - ${targetSport.name}` });
});

exports.editSportPOST = [
  body('sportName').trim().escape(),
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const [targetSport] = await Sport.find({ _id: req.params.id });
    const sportName = capitalise(req.body.sportName);
    const newSport = new Sport({ _id: targetSport._id, name: sportName });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./sports/sport-form', { sport: newSport, errors: errors.array(), title: `Edit Sport - ${targetSport.name}` });
    } else {
      const duplicateCheck = await Sport.find({ name: newSport.name });
      if (duplicateCheck.length > 0) {
        res.render('./sports/sport-form', {
          sport: newSport, errors: errors.array(), title: `Edit Sport - ${targetSport.name}`, duplicateError: `'${newSport.name}' already exists`,
        });
      } else {
        const updatedSport = await Sport.findOneAndUpdate({ _id: req.params.id }, newSport);
        res.redirect(updatedSport.url);
      }
    }
  }),
];

exports.deleteSportGET = asyncHandler(async (req, res, next) => {
  const targetSport = await Sport.findById(req.params.id);
  res.render('./sports/sport-delete', { sport: targetSport });
});

exports.deleteSportPOST = [
  body('password').equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const targetSport = await Sport.findById(req.params.id);

    if (!errors.isEmpty()) {
      res.render('./sports/sport-delete', { sport: targetSport, errors: errors.array() });
    } else {
      await Sport.findByIdAndDelete(req.params.id);
      res.redirect('/sports');
    }
  }),
];
