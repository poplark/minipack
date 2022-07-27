const fs = require('fs');
// const parser = require('acorn');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAstSync: generate } = require('@babel/core');

module.exports = {

  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');
    const ast = parser.parse(source, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    });
    return ast;
  },

  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({node}) => {
        dependencies.push(node.source.value);
      }
    });
    return dependencies;
  },

  transform: (ast, filename) => {
    const { code, map } = generate(ast, filename, {
      presets: ['@babel/preset-env'],
      sourceMaps: true,
    });
    return code;
  },
}
