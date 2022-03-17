const Pool = require('pg').Pool
const pool = new Pool({
  user: 'robertlh1',
  host: 'localhost',
  database: 'mvp',
  password: 'yeeboy',
  port: 5432,
})

module.exports = {pool: pool}