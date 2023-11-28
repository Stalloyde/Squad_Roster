const express = require('express');
const asyncHandler = require('express-async-handler');
const Athlete = require('../models/athlete');

exports.athletesDirectory = asyncHandler(async (req, res, next) => {
  const athletes = await Athlete.find().populate('sport').sort({ lastName: 1 });
  res.render('athletes', { athletes });
});
