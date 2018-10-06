const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');
const Joi = require('joi');
const Mustache = require('mustache');

const templateFile = 'cookbook.mustache';

// Schema for validating ORF format
const schema = Joi.object().keys({
  // Recipe identifiers
  recipe_name: Joi.string().allow(null),
  recipe_uuid: Joi.string().allow(null),

  // Recipe source information
  source_book: Joi.object().keys({
    title: Joi.string(),
    authors: Joi.array().items(Joi.string()),
    isbn: Joi.string().allow(null),
    notes: Joi.string().allow(null)
  }).pattern(/X-\w+/, Joi.any()).allow(null),
  source_authors: Joi.string().allow(null),
  source_url: Joi.string().allow(null),

  // Oven settings
  oven_fan: Joi.string().valid('Off', 'Low', 'High'),
  oven_temp: Joi.object().keys({
    amount: Joi.number(),
    unit: Joi.string().valid('C', 'F')
  }),
  oven_time: [Joi.string(), Joi.number()],

  // Ingredients list for the recipe
  ingredients: Joi.array().items(Joi.object().keys({
    ingredient: Joi.string().required(),
    amounts: Joi.array().items(Joi.object().keys({
      amount: Joi.alternatives([Joi.string(), Joi.number()]).required(),
      unit: Joi.string().required()
    })).min(1).required(),
    processing: Joi.array().items(Joi.string()).min(1),
    notes: Joi.array().items(Joi.string()).min(1),
    usda_num: [Joi.string(), Joi.number()],
    substitutions: Joi.array().items(Joi.object().keys({
      ingredient: Joi.string().required(),
      amounts: Joi.array().items(Joi.object().keys({
        amount: Joi.alternatives([Joi.string(), Joi.number()]).required(),
        unit: Joi.string().required()
      })).min(1).required(),
      processing: Joi.array().items(Joi.string()),
      notes: Joi.array().items(Joi.string()).min(1),
      usda_num: Joi.string()
    })).min(1)
  })).min(1).required(),

  // Steps for the recipe
  steps: Joi.array().items(Joi.object().keys({
    step: Joi.string().required(),
    haccp: Joi.object().keys({
      control_point: Joi.string(),
      critical_control_point: Joi.string()
    }),
    notes: Joi.array().items(Joi.string()).min(1)
  })).min(1).required(),

  // How much the recipe makes
  yields: Joi.array().items(Joi.object().keys({
    amount: Joi.alternatives([Joi.string(), Joi.number()]).required(),
    unit: Joi.string().required()
  })).min(1).required(),

  // Notes about the whole recipe
  notes: Joi.array().items(Joi.string()).min(1)
}).pattern(/X-\w+/, Joi.any());

/**
 * Loads an open recipe file and validates it
 * Returns null if the file fails ORF validation
 */
function load(file) {
  let result = null;
  let openRecipe = yaml.safeLoad(fs.readFileSync(file));

  Joi.validate(openRecipe, schema, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      result = openRecipe;
    }
  });

  return result;
}

/**
 * Converts an object in open recipe format to html
 * @param {object} openRecipe the open recipe object loaded from a file
 * @return {string} the templated file
 */
function render(openRecipe) {
  const template = path.join(__dirname, templateFile);
  return Mustache.render(fs.readFileSync(template, 'utf-8'), openRecipe);
}

module.exports = {
  load: load,
  render: render
};
