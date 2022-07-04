const express = require ('express');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://Picaljean313:Pical@cluster0.0qml6.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Vous êtes bien connectés à MungoDB !'))
  .catch(() => console.log('Échec de la connexion à MungoDB'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
