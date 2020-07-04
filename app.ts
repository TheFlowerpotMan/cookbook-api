import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import https from 'https';
var connInfo = require('../../cookbook-api-conn.json');
var app = express();

var pool = mysql.createPool(connInfo.db);

// Fetch all recipes
app.get('/recipes', function (req, res) {
  console.log('Fetching all recipes');
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    connection.query('SELECT * FROM `recipes`', function (err, rows, fields) {
      if (err) {
        connection.release();
        console.log(err);
        throw err
      };
      console.log('Recipe query successful');
      res.send(JSON.stringify(rows));
      res.status(500).send(err);
    });
  });
});

// Wildlcard route
app.get('*', function (req, res) {
  console.log('Hit wildcard route');
  res.send('There is nothing at this endpoint');
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
  .listen(9000, function () {
    console.log('Cookbook API listening on port 9000!');
  });