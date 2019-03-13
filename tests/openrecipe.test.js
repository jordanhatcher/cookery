const path = require('path');
const fs = require('fs');
const chai = require('chai');
const should = chai.should();

const { load, render } = require('../src/openrecipe');

describe('openrecipe.js', function() {
  describe('.load(file)', function() {
    it('should load a valid open recipe file', function() {
      const openrecipe = load(path.join(__dirname, './assets/validOpenRecipeFile.yml'));
      openrecipe.should.have.ownProperty('recipe_name').that.is.a('string');
      openrecipe.should.have.ownProperty('ingredients').that.is.an('array');
      openrecipe.should.have.ownProperty('steps').that.is.an('array');
    });

    it('should throw an exception when loading an invalid file', function() {
      should.Throw(() => load(path.join(__dirname, './assets/invalidOpenRecipeFile.yml')),
        'ValidationError: child "ingredients" fails because ["ingredients" is required]');
    });
  });

  describe('.render(openRecipeObject)', function() {
    it('should render an open recipe object', function() {
      const openRecipeObject = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/openRecipeFormatObject.json')));
      const renderedContent = render(openRecipeObject);

      renderedContent.should.be.a('string');
      renderedContent.should.include('Banana Bread');
      renderedContent.should.include('Ingredients');
      renderedContent.should.include('Steps');
    });
  });
});