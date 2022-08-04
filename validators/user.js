exports.connectionDataToValidate = ([email, password]) => {
  return [
    {
      value : email,
      expectedType : "string",
      mask : /^[^\s\.@]{1,50}@[^\s\.@]{1,50}\.[^\s\.@]{1,10}$/
    },
    {
      value: password,
      expectedType : "string",
      mask : /^\S{3,20}$/
    }
  ];
}; 
