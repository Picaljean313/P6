const multer = require('multer');
const rules = require('../validators/rules');
const multerConfig = require('../validators/multer-config');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const uploadFilter = (req, file, callback) => {
  const validFile = rules.valid(multerConfig.fileToValidate, file);
  if (validFile){
    callback(null, true);
  } else {
    callback(null,false);
    req.fileFilter = true;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage : storage, fileFilter : uploadFilter, limits : { files : 1, fields : 1 } }).single('image');

module.exports = (req, res, next) => {
  upload(req, res, error => {
    if (error) return res.status(400).json({ message : "Veuillez ne renseigner au maximum qu'un seul champ 'Text', et un seul champ 'File' qui doit être appelé 'image' " })
    else {
      next();
    }
  })
}


