// Node & React application for HW3
// Name: Nathaniel Park

// Credit information for dataset:
/* NOAA National Centers for Environmental information, Climate at a Glance: Global Time Series, 
    published September 2021, retrieved on September 29, 2021 from 
    https://www.ncdc.noaa.gov/cag/ */

// Require all necessary packages
const express = require('express');
const fetch = require('node-fetch')
const path = require('path');
const admin = require('firebase-admin');

// Require extra file information as necessary
const statistic = require('./extras/statistic');

// Setup firebase admin credential
const serviceAccount = require('./swe-432-hw3-cbfd1-firebase-adminsdk-nqt6l-8f30775f28.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// Setup Express
const app = express()
app.use(express.static(path.join(__dirname, 'client/build'))); 

// Setup dataset and statistics for use
let NOAA_Statistics = new statistic.Statistic();

// Use firebase when possible for persistent data.
// Promise -> then check entry -> then check etc. Needless to say that refilling the db is also covered.
const dataset = db.collection('noaa_statistics').doc('dataset');
dataset.get()
  .then((doc) => {
    if( doc.exists ) {
      NOAA_Statistics.setDataset(doc.data());
    } else {
      fetch('https://www.ncdc.noaa.gov/cag/global/time-series/globe/land_ocean/ytd/12/1880-2021/data.json') 
        .then(response => response.json())
        .then(body => { 
          NOAA_Statistics.setDataset(body.data); // Ensure that the promise is resolved
          db.collection('noaa_statistics').doc('dataset').set(body.data);
        });
    }
  });

// GET Endpoints
app.get('/dataset', (req, res) => { // Retrieve Dataset
  let docRef = db.collection('noaa_statistics').doc('dataset');
  docRef.get()
    .then((doc) => {
      if( doc.exists ) {
        res.send(doc.data());
      } else {
        res.sendStatus(404);
      }
    });
});

app.get('/dataset/average', (req, res) => { // Retrieve Average Dataset
  let docRef = db.collection('noaa_statistics').doc('averages');
  docRef.get()
    .then((doc) => {
      if( doc.exists ) {
        res.send(doc.data());
      } else {
        res.sendStatus(404);
      }
    });
});

app.get('/minran/:minrange/maxran/:maxrange/maximum', (req, res) => { // Get the maximum from specified yearly range.
  const minRange = req.params['minrange'];
  const maxRange = req.params['maxrange'];
  const range = `${minRange}-${maxRange}`;
  let maximum = 0;
  
  if( minRange === undefined || maxRange === undefined ){
    res.sendStatus(400);
  } else {
    if( parseInt(minRange) > parseInt(maxRange) ) // Check when the range is incorrect
      res.sendStatus(400);
    else {
      let docRef = db.collection('noaa_statistics').doc('maximums');
      docRef.get()
        .then((doc) => {
          if( doc.exists ) {                                          // Ensure the doc exists.
            if( doc.data()[range] !== undefined ) {                   // If so, ensure that there is valid year range
              maximum = {[range]: doc.data()[range]};
            } else {                                                  // Else we can assume that the statistic needs to include the previous ranges
              const newDataset = NOAA_Statistics.range(minRange, maxRange);
              maximum = NOAA_Statistics.max(newDataset);
              const newMaximum = {[range]: maximum};
              db.collection('noaa_statistics').doc('maximums').update({...doc.data(), ...newMaximum});
              
              maximum = newMaximum;
            }
          } else {                                                    // Set a new data entry into the collection
            const newDataset = NOAA_Statistics.range(minRange, maxRange);
            maximum = NOAA_Statistics.max(newDataset);
            const newMaximum = {[range]: maximum};
            db.collection('noaa_statistics').doc('maximums').set({...doc.data(), ...newMaximum});
            
            maximum = newMaximum;
          }
          res.send(maximum);
        });
    }
  }
});

app.get('/minran/:minrange/maxran/:maxrange/minimum', (req, res) => { // Get the minimum from specified yearly range.
  const minRange = req.params['minrange'];
  const maxRange = req.params['maxrange'];
  const range = `${minRange}-${maxRange}`;
  let minimum = 0;
  
  if( minRange === undefined || maxRange === undefined ){
    res.sendStatus(400);
  } else {
    if( parseInt(minRange) > parseInt(maxRange) ) // Check when the range is incorrect
      res.sendStatus(400);
    else {
      let docRef = db.collection('noaa_statistics').doc('minimums');
      docRef.get()
        .then((doc) => {
          if( doc.exists ) {
            if( doc.data()[range] !== undefined ) {
              minimum = {[range]: doc.data()[range]};
            } else {
              const newDataset = NOAA_Statistics.range(minRange, maxRange);
              minimum = NOAA_Statistics.min(newDataset);
              const newMinimum = {[range]: minimum};
              db.collection('noaa_statistics').doc('minimums').update({...doc.data(), ...newMinimum});
              
              minimum = newMinimum;
            }
          } else {
            const newDataset = NOAA_Statistics.range(minRange, maxRange);
            minimum = NOAA_Statistics.min(newDataset);
            const newMinimum = {[range]: minimum};
            db.collection('noaa_statistics').doc('minimums').set({...doc.data(), ...newMinimum});
            
            minimum = newMinimum;
          }
          res.send(minimum);
        });
    }
  }
});

app.get('/minran/:minrange/maxran/:maxrange/average', (req, res) => { // Get average value from specified yearly range.
  const minRange = req.params['minrange'];
  const maxRange = req.params['maxrange'];
  const range = `${minRange}-${maxRange}`;
  let average = 0;
  
  if( minRange === undefined || maxRange === undefined ){
    res.sendStatus(400);
  } else {
    if( parseInt(minRange) > parseInt(maxRange) ) // Check when the range is incorrect
      res.sendStatus(400);
    else {
      let docRef = db.collection('noaa_statistics').doc('averages');
      docRef.get()
        .then((doc) => {
          if( doc.exists ) {
            if( doc.data()[range] !== undefined ) {
              average = {[range]: doc.data()[range]};
            } else {
              const newDataset = NOAA_Statistics.range(minRange, maxRange);
              average = NOAA_Statistics.avg(newDataset);
              const newAverage = {[range]: average};
              db.collection('noaa_statistics').doc('averages').update({...doc.data(), ...newAverage});
              
              average = newAverage;
            }
          } else {
            const newDataset = NOAA_Statistics.range(minRange, maxRange);
            average = NOAA_Statistics.avg(newDataset);
            const newAverage = {[range]: average};
            db.collection('noaa_statistics').doc('averages').set({...doc.data(), ...newAverage});
            
            average = newAverage;
          }
          res.send(average);
        });
    }
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

module.exports = app;