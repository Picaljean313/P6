exports.tokenToValidate = (token) => {
  return [
    {
      value : token,
      expectedType : "string",
      mask : /^Bearer\s\S+$/,
      minLength : 10,
      maxLength : 500
    }
  ]
};