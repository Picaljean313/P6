const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'HARIBO_C_EST_BEAU_LA_VIE');
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId
    };
    next();
  }
  catch (error) {
    req.status(403).json({ error })
  };
};