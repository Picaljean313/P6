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
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res ,next) => {
  const includedFile = req.file ? true : false;
  const includedSauceBody = req.body.sauce ? true : false;
  const validFormDataSauce = rules.valid(sauces.formDataSauceToValidate, req.body.sauce);
  if (!includedFile){
    functions.resMessage(res, 400, "Veuillez mettre un fichier image, dont le nom ne dépasse pas le nombre de caractères requis");
  } else {
    if (!includedSauceBody){
      functions.unlinkFile(req, res, "Veuillez renseigner un champ 'Text' dont le nom est 'sauce ");
    } else {
      if (!validFormDataSauce){
        functions.unlinkFile(req, res, "Veuillez renseigner correctement le champ Text 'sauce' ");
      } else {
        const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, JSON.parse(req.body.sauce));
        if (!validJsonSauce){
          functions.unlinkFile(req, res, "Veuillez renseigner correctement les propriétés 'name', 'manufacturer', 'description', 'mainPepper' et 'heat' de votre objet sauce ");
        } else {
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
        }
      }
    }
  }
};

exports.modifySauce = (req, res ,next) => {
  const includedFile = req.file ? true : false;
  const includedSauceBody = req.body.sauce ? true : false;
  const validFormDataSauce = rules.valid(sauces.formDataSauceToValidate, req.body.sauce);
  const fileFiltered = req.fileFilter;
  let sauceObject;
  if (!includedFile){
    if (fileFiltered) {
      functions.resMessage(res, 400, "Veuillez mettre un fichier image, dont le nom ne dépasse pas le nombre de caractères requis")
    } else {
      const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, req.body);
      if (!validJsonSauce){
        functions.resMessage(res, 400, "Veuillez indiquer des données correctes pour votre sauce, en format JSON")
      } else {
        sauceObject = {...req.body};
        delete sauceObject.userId;
        const validSauceObject = Object.keys(sauceObject).length === 5 ? true : false;
        console.log(validSauceObject);
        if (!validSauceObject){
          functions.resMessage(res, 400, "Veuillez ne renseigner que les propriétés de la sauce qui sont modifiables ")
        } else {
          const includedId = req.params.id ? true : false;
          if (includedId){
            Sauce.findOne({ id : req.params.id })
              .then(sauce => {
                if (sauce.userId !== req.auth.userId){
                  functions.resMessage(res, 403, "Non autorisé")
                } else {
                }
              })
              .catch(

              )
          }

          // Sauce.findOne({ _id: req.params.id })
          //   .then(sauce => {
          //     if (sauce.userId != req.auth.userId){
          //       res.status(403).json({ message: 'Non autorisé'})
          //     } else {
          //       if (req.file){
          //         const filename = sauce.imageUrl.split('/images/')[1];
          //         fs.unlink(`images/${filename}`, () => {
          //         Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
          //           .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
          //           .catch(error => res.status(400).json({ error }));
          //         });
          //       } else {
          //         Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
          //         .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
          //         .catch(error => res.status(400).json({ error }));
          //       }
          //     }
          //   })
          //   .catch(error => res.status(400).json({ error }));






        }
      }
    }
  } else {

  }


//   if(includedFile){
//     if (!includedSauceBody){
//       try {
//         fs.unlink(`images/${req.file.filename}`, () => {
//           res.status(400).json({ message : "Veuillez renseigner un champ 'Text' dont le nom est 'sauce "});
//         });
//       } catch {
//         error => res.status(500).json({ error })
//       }
//     } else {
//       if (!validFormDataSauce){
//         try {
//           fs.unlink(`images/${req.file.filename}`, () => {
//             res.status(400).json({ message : "Veuillez renseigner correctement le champ Text 'sauce' "})
//           });
//         } catch {
//           error => res.status(500).json({ error })
//         }
//       } else {
//         const validJsonSauce =  rules.valid(sauces.jsonSauceToValidate, JSON.parse(req.body.sauce));
//         if (!validJsonSauce){
//           try {
//             fs.unlink(`images/${req.file.filename}`, () => {
//               res.status(400).json({ message : "Veuillez renseigner correctement les propriétés 'name', 'manufacturer', 'description', 'mainPepper' et 'heat' de votre objet sauce "});
//             });
//           } catch {
//             error => res.status(500).json({ error })
//           }
//         } else {

//         }

//       }



  // } else {

  // }




/*  const includedFile = req.file ? true : false;
  const ValidSauceFormData = valid(sauceFormDataToValidate, req.body.sauce);
  const validSauceJson = ValidSauceFormData ? valid(sauceJsonToValidate, JSON.parse(req.body.sauce)) : false;
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId){
        res.status(403).json({ message: 'Non autorisé'})
      } else {
        if (req.file){
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
            .catch(error => res.status(400).json({ error }));
          });
        } else {
          Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
          .catch(error => res.status(400).json({ error }));
        }
      }
    })
    .catch(error => res.status(400).json({ error }));  
    */
};  

exports.deleteSauce = (req, res ,next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if ( sauce.userId != req.auth.userId ){
        res.status(403).json({ message: 'Non autorisé'})
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
            .catch(error => res.status(500).json({ error }));
        });
      }
    })
    .catch(error => res.status(404).json({ error }));
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