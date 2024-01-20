// Custom validator for username
const isValidUsername = (value) => {
  return /^[a-zA-Z0-9_]+$/.test(value);
};

module.exports = {isValidUsername};