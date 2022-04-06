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
// const serverAddress = 'http://ec2-13-57-254-191.us-west-1.compute.amazonaws.com'
const serverAddress = 'http://localhost:4000'
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
  console.log('Recieved download request')
  let file = req.params[0].split('/')
  db.pool.query('SELECT filename FROM files WHERE hash = $1', [file[1]], (err, result) => {
    if (err) {
      console.log('Download Failed', err)
      res.status(404).send('This file does not exist.')
    } else {
      let downloadFile = `./db/files/${file[0]}/${result.rows[0].filename}`
      console.log(downloadFile, ' successfully downloaded')
      res.download(downloadFile)
    }
  })
})

app.post('/api/delete', (req, res) => {
  console.log('Recieved delete request')
  db.pool.query(`DELETE FROM files WHERE hash = $1 AND user_id = $2`, [req.body.hash, req.body.userID], (err, result) => {
    if (err) {
      console.log('Database deletion failed', err)
      res.send(err)
    } else {
      fs.unlink(`./db/files/${req.body.userID}/${req.body.filename}`, (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.log('Delete failed', deleteErr)
          res.send(deleteErr)
        } else {
          console.log(`${req.body.filename} successfully deleted by user ${req.body.userID}`)
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
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      console.log(`${req.body.username} has registered`)
      fs.mkdirSync(path.join(__dirname, "../", "db", "files", JSON.stringify(results.rows[0].id)))
      res.send(results.rows)
    }
  })
})

app.post('/api/files', (req, res) => {
  try {
    db.pool.query(`SELECT filename, url, hash FROM files WHERE user_id = $1 ORDER BY date_created DESC`, [req.body.userID], (err, result) => {
      if (err) {
        res.status(500).send()
      } else {
        res.send(result.rows)
      }
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
      file.mv('./db/files/' + req.body.userID + '/' + file.name, () => {
        db.pool.query(`INSERT INTO files(user_id, filename, hash, url, date_created, size)
        VALUES ($1, $2, $3, $4, current_timestamp, $5)`, [req.body.userID, file.name, hashed, `${serverAddress}/api/download/${req.body.userID}/${hashed}`, file.size], (err, result) => {
          if (err) {
            res.status(500).send()
          } else {
            console.log(`Uploaded ${file.name} from user ${req.body.userID}`)
            res.send('success')
          }
        })
      })
    }
  } catch (err) {
    res.status(500).send(err);
  }
})