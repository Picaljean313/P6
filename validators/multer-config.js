exports.fileToValidate = (file) => {
  try {
    return [
      {
        value : file,
        expectedType : "object",
        expectedMimetype : ['image/jpeg', 'image/jpg', 'image/png'],
  
      },
      {
        value : file.originalname,
        expectedType : "string",
        mask : /^[\S ]+$/,
        minLength : 1,
        maxLength : 100
      }
    ]
  } 
  catch {
    return [
      {
        value : "string",
        expectedType : "number"
      }
    ]
  }
};
