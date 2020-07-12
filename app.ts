import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import http from 'http';
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
    connection.query(`
      SELECT 
        * 
      FROM recipes r 
      JOIN instruction_steps is ON r.id = is.recipe_id
      JOIN recipe_to_ingredients rti ON r.id = rti.recipe_id
      JOIN ingredients i ON rti.ingredient_id = i.id
      `, function (err, rows, fields) {
      if (err) {
        connection.release();
        console.log(err);
        res.status(500).send(err);
      };
      console.log('Recipe query successful');
      res.status(200).send(JSON.stringify(rows));
      connection.release();
    });
  });
});

// Wildlcard route
app.get('*', function (req, res) {
  console.log('Hit wildcard route');
  res.send('There is nothing at this endpoint');
});

http.createServer(app).listen(connInfo.port, function () {
  console.log(`Cookbook API listening on port ${connInfo.port}!`);
});