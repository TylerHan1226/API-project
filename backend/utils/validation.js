// backend/utils/validation.js
// const { query } = require('express');
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware


const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = new Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    
    return next(err); // Call next with the error
  }
  next();
};

module.exports = {
  handleValidationErrors
};