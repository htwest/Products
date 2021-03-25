const mongoose = require('mongoose');
const Photo = require('../Models/Photo.model');

const photoFetcher = (id) => {
  return Photo.find({ styleId: id })
}

module.exports = photoFetcher;