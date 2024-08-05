require('dotenv').config();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const capitalise = require('./capitalise');
const queries = require('../db/queries');

exports.sportsDirectory = asyncHandler(async (req, res) => {
  const sports = await queries.getAllSports();
  res.render('./sports/sports', { sports });
});

exports.sportDetails = asyncHandler(async (req, res) => {
  const [[sport], sportAthletes, sportStaff] = await Promise.all([
    queries.getSportDetails(req.params.id),
    queries.getSportAthletes(req.params.id),
    queries.getSportStaff(req.params.id),
  ]);

  res.render('./sports/sport-details', {
    sport,
    athletes: sportAthletes,
    staffList: sportStaff,
  });
});

exports.newSportGET = asyncHandler(async (req, res) => {
  res.render('./sports/sport-form');
});

exports.newSportPOST = [
  body('sportName').trim().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const sportName = capitalise(req.body.sportName);
    const newSport = { name: sportName };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('./sports/sport-form', {
        sport: newSport,
        errors: errors.array(),
      });
    } else {
      const [duplicateCheck] = await queries.checkDuplicateSport(sportName);
      if (duplicateCheck) {
        res.render('./sports/sport-form', {
          sport: newSport,
          errors: errors.array(),
          duplicateError: `'${newSport.name}' already exists`,
        });
      } else {
        await queries.createNewSport(req);
        const sports = await queries.getAllSports();
        res.render('./sports/sports', { sports });
      }
    }
  }),
];

exports.editSportGET = asyncHandler(async (req, res) => {
  const [targetSport] = await queries.getTargetSport(req.params.id);
  res.render('./sports/sport-form', {
    sport: targetSport,
    title: `Edit Sport - ${targetSport.name}`,
  });
});

exports.editSportPOST = [
  body('sportName').trim().escape(),
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const sportName = capitalise(req.body.sportName);
    const [targetSport] = await queries.getTargetSport(req.params.id);
    const newSport = { id: targetSport.id, name: sportName };
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./sports/sport-form', {
        sport: newSport,
        errors: errors.array(),
        title: `Edit Sport - ${targetSport.name}`,
      });
    } else {
      const [duplicateCheck] = await queries.checkDuplicateSport(sportName);
      if (duplicateCheck) {
        res.render('./sports/sport-form', {
          sport: newSport,
          errors: errors.array(),
          title: `Edit Sport - ${targetSport.name}`,
          duplicateError: `'${newSport.name}' already exists`,
        });
      } else {
        await queries.editSport(req);
        const sports = await queries.getAllSports();
        res.render('./sports/sports', { sports });
      }
    }
  }),
];

exports.deleteSportGET = asyncHandler(async (req, res) => {
  const [[sport], sportAthletes, sportStaff] = await Promise.all([
    queries.getSportDetails(req.params.id),
    queries.getSportAthletes(req.params.id),
    queries.getSportStaff(req.params.id),
  ]);

  res.render('./sports/sport-delete', {
    sport,
    sportAthletes,
    sportStaff,
  });
});

exports.deleteSportPOST = [
  body('password')
    .equals(process.env.PASSWORD)
    .withMessage('Password incorrect. Please try again.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const [[targetSport], sportAthletes, sportStaff] = await Promise.all([
      queries.getTargetSport(req.params.id),
      queries.getSportAthletes(req.params.id),
      queries.getSportStaff(req.params.id),
    ]);

    if (!errors.isEmpty()) {
      res.render('./sports/sport-delete', {
        sport: targetSport,
        sportAthletes,
        sportStaff,
        errors: errors.array(),
      });
    } else {
      await queries.deleteSport(req.params.id);
      const sports = await queries.getAllSports();
      res.render('./sports/sports', { sports });
    }
  }),
];
