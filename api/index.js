import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import bodyParser from 'body-parser'
import hash from './hash.js'
import { db } from '@vercel/postgres';
import {fileURLToPath} from 'url'
import path from 'path'
import querystring from 'querystring'
import dotenv from 'dotenv'
import { v4 } from 'uuid'
dotenv.config({path: './.env.local'})
const client = await db.connect()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const serverAddress = 'https://json-share.vercel.app'
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

app.get('/api', async (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/download/*', async (req, res) => {
  let file = req.params[0].split('/'), hs = file[1]
  console.log(`Received download request for ${file} at ${new Date()}`)
  try {
    let {rows} = await client.sql`SELECT filename FROM files WHERE hash = ${hs}`
    let downloadFile = `./db/files/${file[0]}/${rows[0].filename}`
    await res.download(downloadFile)
    console.log(`${downloadFile} successfully downloaded at ${new Date()}`)
  } catch(error) {
    console.log('Download Failed', error)
    res.status(404).send('This file does not exist.')
  }
})

app.post('/api/delete', async (req, res) => {
  let ha = req.body.hash, uid = req.body.userID, fn = req.body.filename
  console.log(`Recieved delete request from user ${uid} for file ${ha} at ${new Date()}`)
  try {
    await client.sql`DELETE from files WHERE hash = ${ha} AND user_id = ${uid}`
    fs.unlink(`./db/files/${uid}/${fn}`, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.log('Unable to delete file from hard drive', deleteErr)
        res.send(deleteErr)
      }
      console.log(`${fn} successfully deleted by user ${uid} at ${new Date()}`)
      res.send(deleteResult)
    })
  } catch(error) {
    console.log('Database deletion failed', error)
    res.send(error)
  }
})

app.post('/api/login', async (req, res) => {
  let un = req.body.username, pw = req.body.password
  try {
    const { rows } = await client.sql`SELECT id, username FROM users WHERE username = ${un} AND password = crypt(${pw}, password)`
    console.log(`${un} has logged in at ${new Date()}`)
    res.send(rows)
  } catch(error) {
    res.status(500).send([{id:'No'}]);
  }
})

app.post('/api/register', async (req, res) => {
  let un = req.body.username, pw = req.body.password, em = req.body.email
  try {
    await client.sql`INSERT INTO users (username, password, email) VALUES (${un}, crypt(${pw}, gen_salt('bf')), ${em}) RETURNING id, username;`
  } catch(error) {
    res.status(500).json({ error });
  }
  try {
    let {rows} = await client.sql`SELECT id, username FROM users WHERE email = ${em}`
    console.log(`${un} has registered at ${new Date()}`)
    fs.mkdirSync(path.join(__dirname, "../", "db", "files", JSON.stringify(rows[0].id)))
    res.send(rows)
  } catch(error) {
    res.status(500).json({error})
  }
})

app.post('/api/files', async (req, res) => {
  let uid = req.body.userID
  try {
    let {rows} = await client.sql`SELECT filename, url, hash FROM files WHERE user_id = ${uid} ORDER BY date_created DESC`
    res.send(rows)
  } catch(error) {
    res.status(500).json(error)
  }
})

app.post('/api/fileUpload', async (req, res) => {
  let uid = req.body.userID, file = req.files.myFile, hashed = hash(file.name)
  let address = `${serverAddress}/api/download/${uid}/${hashed}`
  try {
    if (!req.files) {
      res.send({status: false, message: 'No file received'})
    } else {
      try {
        file.mv(`./db/files/${uid}/${file.name}`, async () => {
          await client.sql`INSERT INTO files(user_id, filename, hash, url, date_created, size) VALUES (${uid}, ${file.name}, ${hashed}, ${address}, current_timestamp, ${file.size})`
        })
      } catch(error) {
        res.status(500).json(error)
      }
    }
  } catch(error) {
    res.status(500).json(error)
  }
  console.log(`Uploaded ${file.name} from user ${req.body.userID}`)
  res.send('success')
})