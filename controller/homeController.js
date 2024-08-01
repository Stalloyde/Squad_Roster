const express = require('express');
const asyncHandler = require('express-async-handler');
const queries = require('../db/queries');

exports.homePage = asyncHandler(async (req, res, next) => {
  const results = await queries.getAllInfo();
  res.send(results);
});
