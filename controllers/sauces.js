const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res ,next) => {
  Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces)
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res ,next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res ,next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res ,next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId){
        req.status(403).json({ message: 'Non autorisé'})
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
          .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => req.status(400).json({ error }));
};

exports.deleteSauce = (req, res ,next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if ( sauce.userId != req.auth.userId ){
        res.status(401).json({ message: 'Non autorisé'})
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
            .catch(error => res.status(500).json({ error }));
        });
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.likeOneSauce = (req, res ,next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like === 1 && sauce.usersLiked.find((e) => e === req.auth.userId) === undefined){
        sauce.usersLiked.push(req.auth.userId);
        sauce.likes++;
        Sauce.updateOne({ _id: sauce._id}, {usersLiked: sauce.usersLiked, likes: sauce.likes})
          .then(() => res.status(200).json({ message: "Sauce likée"}))
          .catch(error => res.status(400).json({ error }));
      };
      if (req.body.like === 0){
        for (let i in sauce.usersLiked){
          if (sauce.usersLiked[i] === req.auth.userId){
            sauce.usersLiked.splice(i, 1);
            sauce.likes--;
            Sauce.updateOne({ _id: sauce._id}, {usersLiked: sauce.usersLiked, likes: sauce.likes})
              .then(() => res.status(200).json({ message: "Like retiré"}))
              .catch(error => res.status(400).json({ error }));
          }
        }
        for (let i in sauce.usersDisliked){
          if (sauce.usersDisliked[i] === req.auth.userId){
            sauce.usersDisliked.splice(i, 1);
            sauce.dislikes--;
            Sauce.updateOne({ _id: sauce._id}, {usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes})
              .then(() => res.status(200).json({ message: "Dislike retiré"}))
              .catch(error => res.status(400).json({ error }));
          }
        }
      }
      if (req.body.like === -1 && sauce.usersDisliked.find((e) => e === req.auth.userId) === undefined){
        sauce.usersDisliked.push(req.auth.userId);
        sauce.dislikes++;
        Sauce.updateOne({ _id: sauce._id}, {usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes})
          .then(() => res.status(200).json({ message: "Sauce dislikée"}))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(400).json({ error }));
};