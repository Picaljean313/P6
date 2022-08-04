const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rules = require('../validators/rules');
const user = require('../validators/user');

exports.signup = (req, res, next) => {
  const validConnectionData = typeof req.body.email === "string" ? rules.valid(user.connectionDataToValidate, [req.body.email.trim(), req.body.password]) : false;
  if(validConnectionData){
    User.findOne({ email: req.body.email.trim() })
      .then(email => {
        if(email === null){
          bcrypt.hash(req.body.password, 10)
            .then(hash => {
              const user = new User ({
                email: req.body.email.trim(),
                password: hash
              });
              user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }))
        } else {
          res.status(401).json({ message : 'Email déjà attitré à un compte' })
        }
      })
      .catch(error => res.status(500).json({ error }))
  } else {
    res.status(401).json({ message : 'Veuillez renseigner des identifiant et mot de passe valides' });
  };
};

exports.login = (req, res, next) => {  
  const validConnectionData = typeof req.body.email === "string" ? rules.valid(user.connectionDataToValidate, [req.body.email.trim(), req.body.password]) : false;
  if(validConnectionData){
    User.findOne({ email: req.body.email.trim()})
      .then(user => {
        if (user === null) {
          res.status(403).json({ message: 'Veuillez renseigner les bons champs email/password' })
        } else {
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (valid){
                res.status(200).json({
                  userId: user._id,
                  token : jwt.sign(
                    { userId: user._id },
                    'HARIBO_C_EST_BEAU_LA_VIE',
                    { expiresIn: '24h' }
                  )
                });
              } else {
                res.status(403).json({ message: 'Veuillez renseigner les bons champs email/password' });
              };
            })
            .catch(error => res.status(500).json({ message : "Le mot de passe n'est pas comparé avec une chaîne de caractères" }));
        }
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(401).json({ message: 'Veuillez renseigner les bons champs email/password' });
  }
};