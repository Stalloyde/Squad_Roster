require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:5432/${process.env.DATABASE}`,
});

async function getAllInfo() {
  const result = await pool.query(
    'SELECT firstName, lastName,sport FROM staff',
  );
  return result;
}
// write queries here

module.exports = {
  getAllInfo,
};
