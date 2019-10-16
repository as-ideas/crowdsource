const replace = require('replace-in-file');
const options = {
  files: 'src/main/locales/*/messages.js',
  from: /\\n/g,
  to: '<br/>',
};

replace(options)
  .then(results => {
    console.log('Replacement results:', results);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
