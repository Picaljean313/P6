const Sauce = require('../models/Sauce');
const fs = require('fs');
const rules = require('../validators/rules');
const sauces = require('../validators/sauces');
const functions = require('../tools/functions');

exports.getAllSauces = (req, res ,next) => {
  Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces)
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res ,next) => {
  const invalidIdParam = !rules.valid(sauces.sauceIdToValidate, req.params.id);
  if (invalidIdParam) return functions.resMessage(res, 400, "Veuillez renseigner un paramètre valide pour votre requête");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res ,next) => {
  const includedFile = req.file ? true : false;
  const includedSauceBody = req.body.sauce ? true : false;
  const validFormDataSauce = rules.valid(sauces.formDataSauceToValidate, req.body.sauce);

  if (!includedFile) return functions.resMessage(res, 400, "Veuillez mettre un fichier image, dont le nom ne dépasse pas le nombre de caractères requis");

  if (!includedSauceBody) return functions.unlinkFile(req, res, 400, "Veuillez renseigner un champ 'Text' dont le nom est 'sauce ");

  if (!validFormDataSauce) return functions.unlinkFile(req, res, 400, "Veuillez renseigner correctement le champ Text 'sauce' ");

  const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, JSON.parse(req.body.sauce));
  if (!validJsonSauce) return functions.unlinkFile(req, res, 400, "Veuillez renseigner correctement les propriétés 'name', 'manufacturer', 'description', 'mainPepper' et 'heat' de votre objet sauce ");

  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
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
    .then(() => functions.resMessage(res, 201, "Sauce créée"))
    .catch(error => res.status(500).json({ error }));
};

exports.modifySauce = (req, res ,next) => {
  const includedFile = req.file ? true : false;
  const fileFiltered = req.fileFilter;
  const invalidIdParam = !rules.valid(sauces.sauceIdToValidate, req.params.id);
  if (invalidIdParam) return functions.resMessage(res, 400, "Veuillez renseigner un paramètre valide pour votre requête");

  if (!includedFile){
    if (fileFiltered) return functions.resMessage(res, 400, "Veuillez mettre un fichier image, dont le nom ne dépasse pas le nombre de caractères requis");
    
    const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, req.body);
    if (!validJsonSauce) return functions.resMessage(res, 400, "Veuillez indiquer des données correctes pour votre sauce, en format JSON");
    
    const sauceObject = {...req.body};
    delete sauceObject.userId;
    const validSauceObject = Object.keys(sauceObject).length === 5 ? true : false;
    if (!validSauceObject) return functions.resMessage(res, 400, "Veuillez ne renseigner que les propriétés de la sauce qui sont modifiables");
    
    Sauce.findOne({ _id : req.params.id })
      .then(sauce => {
        if (sauce === null) return functions.resMessage(res, 404, "Veuillez renseigner un identifiant de sauce existant pour votre requête");
        
        if (sauce.userId !== req.auth.userId) return functions.resMessage(res, 403, "Non autorisé");
        
        const noChanges = functions.saucesPropertiesComparison(sauceObject, sauce);
        if (noChanges) return functions.resMessage(res, 400, "Veuillez modifier au moins un paramètre de la sauce");

        Sauce.updateOne({ _id : req.params.id }, { ...sauceObject, _id : req.params.id })
          .then(() => {
            functions.resMessage(res, 200, "Sauce modifiée");
          })
          .catch(error => {
            res.status(500).json({ error });
          })
      })
      .catch( error => {
        res.status(500).json({ error });
      }) 
  } 
  else {
    const includedSauceBody = req.body.sauce ? true : false;
    const validFormDataSauce = rules.valid(sauces.formDataSauceToValidate, req.body.sauce);
    if (!includedSauceBody) return functions.unlinkFile(req, res, 400, "Veuillez renseigner un champ 'Text' dont le nom est 'sauce ");

    if (!validFormDataSauce) return functions.unlinkFile(req, res, 400, "Veuillez renseigner correctement le champ Text 'sauce' ");
  
    const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, JSON.parse(req.body.sauce));
    if (!validJsonSauce) return functions.unlinkFile(req, res, 400, "Veuillez renseigner correctement les propriétés 'name', 'manufacturer', 'description', 'mainPepper' et 'heat' de votre objet sauce ");
  
    const sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };
    delete sauceObject.userId;
    const validSauceObject = Object.keys(sauceObject).length === 6 ? true : false;
    if (!validSauceObject) return functions.unlinkFile(req, res, 400, "Veuillez ne renseigner que les propriétés de la sauce qui sont modifiables, ainsi que la photo si vous le souhaitez");

    Sauce.findOne({ _id : req.params.id })
      .then(sauce => {
        if (sauce === null) return functions.unlinkFile(req, res, 404, "Veuillez renseigner un identifiant de sauce existant pour votre requête");
        
        if (sauce.userId !== req.auth.userId) return functions.unlinkFile(req, res, 403, "Non autorisé");

        Sauce.updateOne({ _id : req.params.id }, { ...sauceObject, _id : req.params.id })
          .then(() => {
            try {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                functions.resMessage(res, 200, "Sauce modifiée");
              })
            } catch {
              res.status(500).json({ error });
            }
          })
          .catch(error => {
            functions.unlinkFile(req, res, 500, error);
          })
      })
      .catch( error => {
        functions.unlinkFile(req, res, 500, error);
      }) 
  }
};

exports.deleteSauce = (req, res ,next) => {
  const invalidIdParam = !rules.valid(sauces.sauceIdToValidate, req.params.id);
  if (invalidIdParam) return functions.resMessage(res, 400, "Veuillez renseigner un paramètre valide pour votre requête");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce === null) return functions.resMessage(res, 404, "Veuillez renseigner un identifiant de sauce existant pour votre requête");

      if ( sauce.userId != req.auth.userId ) return functions.resMessage(res, 403, "Non autorisé");
      
      try {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {functions.resMessage(res, 200, "Sauce supprimée");})
            .catch(error => {res.status(500).json({ error });});
        });
      } catch { error => 
        res.status(500).json({ error });
      }
    })
    .catch(error => res.status(404).json({ error }));
};

exports.likeOneSauce = (req, res ,next) => {
  const invalidIdParam = !rules.valid(sauces.sauceIdToValidate, req.params.id);
  if (invalidIdParam) return functions.resMessage(res, 400, "Veuillez renseigner un paramètre valide pour votre requête");
  
  const validLike = rules.valid(sauces.likeToValidate, req.body);
  if (!validLike) return functions.resMessage(res, 400, "Veuillez renseigner correctement la valeur de votre like");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce === null) return functions.resMessage(res, 404, "Veuillez renseigner un identifiant de sauce existant pour votre requête");

      const userHasAlreadyLiked = sauce.usersLiked.find((e) => e === req.auth.userId) !== undefined;
      const userHasAlreadyDisliked = sauce.usersDisliked.find((e) => e === req.auth.userId) !== undefined;
      if (userHasAlreadyLiked && userHasAlreadyDisliked) return functions.resMessage(res, 500, "Erreur dans la gestion des likes et dislikes");

      if (req.body.like === 1){
        if (userHasAlreadyLiked) return functions.resMessage(res, 400, "Cet utilisateur a déjà liké cette sauce");

        if (userHasAlreadyDisliked) return functions.resMessage(res, 400, "Un utilisateur ne peut pas liker et disliker une sauce simultanément");

        sauce.usersLiked.push(req.auth.userId);
        sauce.likes++;
        Sauce.updateOne({ _id: sauce._id}, {usersLiked: sauce.usersLiked, likes: sauce.likes})
          .then(() => functions.resMessage(res, 200, "Sauce likée"))
          .catch(error => res.status(400).json({ error }))

      }
      if (req.body.like === 0){
        if (!userHasAlreadyLiked && !userHasAlreadyDisliked) return functions.resMessage(res, 400, "Impossible de retirer un like ou dislike si l'utilisateur n'a pas déjà liké ou disliké la sauce");
        
        if (userHasAlreadyLiked){
          const index = sauce.usersLiked.indexOf(req.auth.userId);
          sauce.usersLiked.splice(index, 1);
          sauce.likes--;
          Sauce.updateOne({ _id: sauce._id}, {usersLiked: sauce.usersLiked, likes: sauce.likes})
            .then(() => functions.resMessage(res, 200, "Like retiré"))
            .catch(error => res.status(400).json({ error }));
        }
        
        if (userHasAlreadyDisliked){
          const index = sauce.usersDisliked.indexOf(req.auth.userId);
          sauce.usersDisliked.splice(index, 1);
          sauce.dislikes--;
          Sauce.updateOne({ _id: sauce._id}, {usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes})
            .then(() => functions.resMessage(res, 200, "Dislike retiré"))
            .catch(error => res.status(400).json({ error }));
        }
      }
      if (req.body.like === -1){
        if (userHasAlreadyDisliked) return functions.resMessage(res, 400, "Cet utilisateur a déjà disliké cette sauce");

        if (userHasAlreadyLiked) return functions.resMessage(res, 400, "Un utilisateur ne peut pas liker et disliker une sauce simultanément");

        sauce.usersDisliked.push(req.auth.userId);
        sauce.dislikes++;
        Sauce.updateOne({ _id: sauce._id}, {usersDisliked: sauce.usersDisliked, dislikes: sauce.dislikes})
          .then(() => res.status(200).json({ message: "Sauce dislikée"}))
          .catch(error => res.status(400).json({ error }));        
      }
    })
    .catch(error => res.status(400).json({ error }));
};