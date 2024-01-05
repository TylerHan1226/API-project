// backend/utils/validation.js
const { query } = require('express');
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

//Add Query Filters to Get All Events
const validateQuery = (query) => {
  let {page, size, name, type, startDate} = query
  const error = {}
  
  page = parseInt(page)
  size = parseInt(size)

  if (page < 1) error.page = "Page must be greater than or equal to 1"
  if (size < 1) error.size = "Size must be greater than or equal to 1"
  if (typeof name !== 'string') error.name = "Name must be a string"
  if (type !== 'Online' && type !== 'In person') error.name = "Type must be 'Online' or 'In Person'"
  if (typeof startDate !== 'string' || startDate.length !== 10) error.startDate = "Start date must be a valid date time"

  return error
}


module.exports = {
  handleValidationErrors,
  validateQuery
};