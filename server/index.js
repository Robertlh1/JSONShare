const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const bodyParser = require('body-parser');
const hash = require('./hash.js')
const db = require('../db/connection.js');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const app = express();
app.use(express.static(path.join(__dirname, '../', 'client', 'dist')))
app.use(express.static(path.join(__dirname, '../', 'client', 'dist', 'assets')))
app.use(fileUpload({
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})

app.get('/api/download/*', (req, res) => {
  db.pool.query('SELECT filename FROM files WHERE hash = $1', [req.params[0]], (err, result) => {
    if (err) {
      res.status(404).send('This file does not exist.')
    } else {
      res.download(`./db/files/${result.rows[0].filename}`)
    }
  })
})

app.post('/api/delete', (req, res) => {
  console.log('Recieved delete request')
  db.pool.query(`DELETE FROM files WHERE hash = $1`, [req.body.hash], (err, result) => {
    if (err) {
      console.log('DB Failed', err)
      res.send(err)
    } else {
      console.log('DB Success')
      fs.unlink(`./db/files/${req.body.filename}`, (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.log('Delete Failed', deleteErr)
          res.send(deleteErr)
        } else {
          console.log('Delete Success')
          res.send(deleteResult)
        }
      })
    }
  })
})

app.post('/api/login', (req, res) => {
  db.pool.query(`SELECT id, username FROM users WHERE username = $1 AND password = crypt($2, password)`, [req.body.username, req.body.password], (err, result) => {
    if (result.rows.length === 0) {
      res.send([{id: 'No'}])
    } else {
      res.send(result.rows)
    }
  })
})

app.post('/api/register', (req, res) => {
  db.pool.query(`INSERT INTO users (username, password, email) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING id, username`, [req.body.username, req.body.password, req.body.email], (err, results) => {
    res.send(results.rows)
  })
})

app.post('/api/files', (req, res) => {
  try {
    db.pool.query(`SELECT filename, url, hash FROM files WHERE user_id = $1 ORDER BY date_created DESC`, [req.body.userID], (err, result) => {
      res.send(result.rows)
    })
  } catch (err) {
    res.status(500).send(err)
  }
})

app.post('/api/fileUpload', (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file recieved'
      })
    } else {
      let file = req.files.myFile
      var hashed = hash(file.name)
      file.mv('./db/files/' + file.name, () => {
        db.pool.query(`INSERT INTO files(user_id, filename, hash, url, date_created, size)
        VALUES ($1, $2, $3, $4, current_timestamp, $5)`, [req.body.userID, file.name, hashed, `http://localhost:4000/api/download/${hashed}`, file.size])
      })
    }
  } catch (err) {
    res.status(500).send(err);
  }
})