#!/usr/bin/env node

// Built-in node modules
const fs = require('fs');
const path = require('path');

// Exernal modules
const program = require('commander');
const yaml = require('js-yaml');

// Local modules
const pdf = require('./pdf');
const openRecipe = require('./openrecipe');

// Constants
const tempHtmlFile = '/tmp/tempCookbook.html';
const pageBreakBefore = '<p style="page-break-before: always;">&nbsp;</p>';
const pageBreakAfter = '<p style="page-break-after: always;">&nbsp;</p>';


program
  .version('0.0.1')
  .option('-n, --name [value]', 'Name of the cookbook PDF')
  .option('-c, --config [value]', 'Name of the cookbook yaml file to render')
  .option('-d, --debug', 'Turns debug logging on')
  .parse(process.argv);

if (typeof program.name !== 'string') {
  console.error('No name for the cookbook provided');
  process.exit(1);
}

let debug = !!program.debug;

// Load cookbook configuration
const defaultConfigFileNames = ['cookbook.yml', 'cookbook.yaml'];
let configFileName = '';

if (typeof program.config === 'string') {
  if (fs.existsSync(program.config)) {
    configFileName = program.config;
  } else {
    console.error(`Cannot find config file ${program.config}`);
    process.exit(1);
  }
} else {
  for (fileName of defaultConfigFileNames) {
    if (fs.existsSync(fileName)) {
      configFileName = fileName;
      break;
    }
  }

  if (!configFileName) {
    console.error('Cannot find a cookbook.yml or cookbook.yaml config file.');
    process.exit(1);
  }
}

const configFilePath = path.join(process.cwd(), configFileName);
const config = yaml.safeLoad(fs.readFileSync(configFilePath));

const openRecipeFiles = config.recipes;
let cookbookHtml = '';

// TODO see if this logic can be done in templating instead
try {
  openRecipeFiles.forEach((openRecipeFile, index) => {
    // Recipe html generation
    const recipe = openRecipe.load(path.join(process.cwd(), openRecipeFile));
    cookbookHtml += openRecipe.render(recipe);
    cookbookHtml += pageBreakAfter;

    if (index !== openRecipeFiles.length - 1) {
      cookbookHtml += pageBreakBefore;
    }
  });

  fs.writeFileSync(tempHtmlFile, cookbookHtml);
} catch (err) {
  console.error('Error generating HTML from ORF file');
  if (debug) console.error(err);
  process.exit(1);
}


// Generate .pdf
pdf.generate(program.name, tempHtmlFile)
  .then(() => console.log('done.'))
  .catch((err) => {
    console.error('Error generating PDF file');
    if (debug) console.error(err);
    process.exit(1);
  });
