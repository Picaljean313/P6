fs = require('fs');

exports.unlinkFile = (req, res, message) => {
  try {
    fs.unlink(`images/${req.file.filename}`, () => {
      res.status(400).json({ message : message });
    });
  } catch {
    error => res.status(500).json({ error })
  }
};

exports.resMessage = (res, status, message) => {
  res.status(status).json({ message : message });
};

exports.saucesPropertiesComparison = (sauce1, sauce2) => {
  const properties = [ "name", "manufacturer", "description", "mainPepper", "heat" ]
  for (let property of properties){
    if (sauce1[property] !== sauce2[property]){
      return false
    }
  }
  return true
};