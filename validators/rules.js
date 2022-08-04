const validationRules = (thing) => {
  if (typeof thing.value !== thing.expectedType) return false
  if (thing.expectedType === "string"){
    try {
      if (thing.mask !== undefined && !thing.mask.test(thing.value)) return false
    } catch {
      return false
    }
    if (thing.minlength !== undefined && thing.value.length < thing.minlength) return false
    if (thing.maxlength !== undefined && thing.value.length > thing.maxlength) return false
  }
  if (thing.expectedType === "number"){
    if (thing.isInteger === true && !Number.isInteger(thing.value)) return false
    if (thing.minValue !== undefined && thing.value < thing.minValue) return false
    if (thing.maxValue !== undefined && thing.value > thing.maxValue) return false
  }
  if (typeof thing.value === 'object'){
    if (thing.expectedMimetype !== undefined){
      if (Array.isArray(thing.expectedMimetype)){
        if (!thing.expectedMimetype.includes(thing.value.mimetype)) return false
      } else {
        if (thing.value.mimetype !== thing.expectedMimetype) return false
      }
    }
  }
  else return true
};

exports.valid = (thingToValidate, data) => {
  return !thingToValidate(data).map(validationRules).includes(false)
};