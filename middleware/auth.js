const jwt = require('jsonwebtoken');
const rules = require('../validators/rules');
const auth = require('../validators/auth');

module.exports = (req, res, next) => {
  const invalidToken = !rules.valid(auth.tokenToValidate, req.headers.authorization);
  if (invalidToken) return res.status(401).json({ message: "Veuillez rajouter votre token d'authentification"})
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'HARIBO_C_EST_BEAU_LA_VIE');
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId
    };
    next();
  }
  catch (error){
    res.status(401).json({ message: "Token invalide"})
  }
};