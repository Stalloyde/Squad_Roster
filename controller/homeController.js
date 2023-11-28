const express = require('express');
const asyncHandler = require('express-async-handler');
const Athlete = require('../models/athlete');
const Staff = require('../models/staff');
const Sport = require('../models/sport');

exports.homePage = asyncHandler(async (req, res, next) => {
  const [athleteCount, staffCount, sportCount] = await Promise.all([
    Athlete.find().count(),
    Staff.find().count(),
    Sport.find().count(),
  ]);

  res.render('home', {
    athleteCount, staffCount, sportCount,
  });
});
