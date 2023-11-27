require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const router = express.Router();
const mongoDB = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.CLUSTER}.uqtjxjp.mongodb.net/?retryWrites=true&w=majority`;

async function main() {
  await mongoose.connect(mongoDB);
}

main().then(console.log('Connected to mongoDB')).catch((err) => console.log(err));

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

module.exports = router;
