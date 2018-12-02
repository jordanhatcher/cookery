#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const program = require('commander');
const yaml = require('js-yaml');
const pdf = require('./pdf');
const openRecipe = require('./openrecipe');

const tempHtmlFile = '/tmp/tempCookbook.html';

program
  .version('0.0.1')
  .option('-n, --name [value]', 'Name of the cookbook PDF')
  .option('-c, --config [value]', 'name of the cookbook yaml file to render')
  .parse(process.argv);

if (typeof program.name !== 'string') {
  console.error('No name for the cookbook provided');
  return;
}

// Load cookbook configuration
const defaultConfigFileNames = ['cookbook.yml', 'cookbook.yaml'];
let configFileName = '';

if (typeof program.config === 'string') {
  if (fs.existsSync(program.config)) {
    configFileName = program.config;
  } else {
    throw new Error(`Cannot find config file ${program.config}`);
  }
} else {
  for (fileName of defaultConfigFileNames) {
    if (fs.existsSync(fileName)) {
      configFileName = fileName;
      break;
    }
  }
  if (!configFileName) throw new Error('Cannot find a cookbook.yml or cookbook.yaml config file.');
}

const configFilePath = path.join(process.cwd(), configFileName);
const config = yaml.safeLoad(fs.readFileSync(configFilePath));

const openRecipeFiles = config.recipes;
let cookbookHtml = '';

// TODO see if this logic can be done in templating instead
openRecipeFiles.forEach((openRecipeFile, index) => {
  // Recipe html generation
  let recipe = openRecipe.load(path.join(process.cwd(), openRecipeFile));
  cookbookHtml += openRecipe.render(recipe);
  cookbookHtml += '<p style="page-break-after: always;">&nbsp;</p>'

  if (index !== openRecipeFiles.length - 1) {
    cookbookHtml += '<p style="page-break-before: always;">&nbsp;</p>'
  }
});

fs.writeFileSync(tempHtmlFile, cookbookHtml);

// Generate .pdf
pdf.generate(program.name, tempHtmlFile);
