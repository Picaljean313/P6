exports.formDataSauceToValidate = (sauce) => {
  try {
    return [
      {
        value : sauce,
        expectedType : "string",
        maxlength : 1000
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
        mask : /^[a-zA-Z0-9\s-']+$/,
        maxlength : 15
      },
      {
        value : sauce.manufacturer,
        expectedType : "string",
        mask : /^[a-zA-Z0-9\s-']+$/,
        maxlength : 50
      },
      {
        value : sauce.description,
        expectedType : "string",
        mask : /^[a-zA-Z0-9\s-']+$/,
        maxlength : 250
      },
      {
        value : sauce.mainPepper,
        expectedType : "string",
        mask : /^[a-zA-Z0-9\s-']+$/,
        maxlength : 50
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
