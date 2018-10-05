/**
 * Function to generate a new PDF using nightmare
 * @param {string} name of the PDF to generate
 * @paran {string} filePath path of the html file to render
 * @return {object} promise
 */
function generate(name, filePath) {
  const Nightmare = require('nightmare');
  const nightmare = Nightmare();

  return new Promise((resolve, reject) => {
    nightmare
      .goto(`file://${filePath}`)
      .pdf(`${name}.pdf`)
      .end()
      .then(() => {
        console.log('done.');
        resolve();
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  generate: generate
};
