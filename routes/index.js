require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const router = express.Router();

const devConnectionString = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.COLLECTION}.uqtjxjp.mongodb.net/${process.env.COLLECTION}?retryWrites=true&w=majority`;
const mongoDB = devConnectionString || process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
}

main().then(console.log('Connected to mongoDB')).catch((err) => console.log(err));

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

module.exports = router;
