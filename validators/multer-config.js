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
        minlength : 1,
        maxlength : 100
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
