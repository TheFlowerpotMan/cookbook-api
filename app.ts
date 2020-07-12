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
        r.id,
        r.title,
        r.prep_time,
        r.cook_time,
        r.servings,
        r.description,
        r.date_modified,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"id":',inst.id,',"sort":',inst.sort_order,',"instruction":"',inst.instruction,'"}') ORDER BY inst.sort_order ASC),']') AS instructions,
        CONCAT('[',GROUP_CONCAT(CONCAT('{"id":',i.id,',"name":',i.name,',"amount":"',rti.amount,',"unit":"',rti.unit,'"}')),']') AS ingredients,
      FROM recipes r
      JOIN instruction_steps inst ON r.id = inst.recipe_id
      JOIN recipe_to_ingredients rti ON r.id = rti.recipe_id
      JOIN ingredients i ON rti.ingredient_id = i.id
      GROUP BY r.id
      ORDER BY r.title ASC
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