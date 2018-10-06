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
  .option('-n, --name [value]', 'Name of the cookbook')
  .option('-n, --config [value]', 'name of the cookbook file config')
  .parse(process.argv);

if (typeof program.name === 'string') {
  // Load recipe book configuration
  let defaultConfigNames = ['cookbook.yml', 'cookbook.yaml'];
  let configFileName = '';
  if (fs.existsSync(defaultConfigNames[0])) {
    configFileName = defaultConfigNames[0];
  } else if (fs.existsSync(defaultConfigNames[1])) {
    configFileName = defaultConfigNames[1];
  } else if (fs.existsSync(program.config)) {
    configFileName = program.config;
  } else {
    throw new Error('Cannot found a cookbook.[yml, yaml] file. If you are using other name for the cookbook config please use the --config flag');
  }

  const recipeBookFilePath = path.join(process.cwd(), configFileName);
  const recipeBookConfig = yaml.safeLoad(fs.readFileSync(recipeBookFilePath));

  const openRecipeFiles = recipeBookConfig.recipes;
  let recipeHtml = '';

  // TODO see if this logic can be done in templating instead
  openRecipeFiles.forEach((openRecipeFile, index) => {
    // Recipe html generation
    let recipe = openRecipe.load(path.join(process.cwd(), openRecipeFile));
    recipeHtml += openRecipe.render(recipe);
    recipeHtml += '<p style="page-break-after: always;">&nbsp;</p>'

    if (index !== openRecipeFiles.length - 1) {
      recipeHtml += '<p style="page-break-before: always;">&nbsp;</p>'
    }
  });

  fs.writeFileSync(tempHtmlFile, recipeHtml);

  // Generate .pdf
  pdf.generate(program.name, tempHtmlFile);
} else {
  console.error('No name for the cookbook provided');
}
