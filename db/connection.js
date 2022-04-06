const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ubuntu',
  host: '172.31.15.140',
  database: 'ubuntu',
  password: 'yeeboy',
  port: 5432,
})

module.exports = {pool: pool}