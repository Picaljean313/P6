exports.formDataSauceToValidate = (sauce) => {
  try {
    return [
      {
        value : sauce,
        expectedType : "string",
        maxLength : 1000
      },
      {
        value : JSON.parse(sauce),
        expectedType : "object"
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

exports.jsonSauceToValidate = (sauce) => {
  try {
    return [
      {
        value : sauce.name,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 15
      },
      {
        value : sauce.manufacturer,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 50
      },
      {
        value : sauce.description,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 250
      },
      {
        value : sauce.mainPepper,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 50
      },
      {
        value : sauce.heat,
        expectedType : "number",
        minValue : 1,
        maxValue : 10,
        isInteger : true
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

exports.sauceIdToValidate = (sauceId) => {
  return [
    {
      value : sauceId,
      expectedType : "string",
      mask : /^[a-z0-9]+$/,
      minLength : 24,
      maxLength : 24
    }
  ]
};

exports.likeToValidate = (sauce) => {
  try {
    return [
      {
        value : sauce.like,
        expectedType : "number",
        minValue : -1,
        maxValue : 1,
        isInteger : true
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