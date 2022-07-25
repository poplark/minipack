const { getAST, getDependencies, transform } = require('./lib/parser');
const path = require('path');

const ast = getAST(path.join(__dirname, 'src/index.js'));

console.log('ast: \n', ast);

const dependencies = getDependencies(ast);

console.log('dependencies: \n', dependencies);

const code = transform(ast);

console.log('code: \n', code);
