const Pool = require('pg').Pool
const pool = new Pool({
  // user: 'robertlh1',
  user: 'ubuntu',
  host: 'localhost',
  database: 'ubuntu',
  password: 'yeeboy',
  port: 5432,
})

module.exports = {pool: pool}