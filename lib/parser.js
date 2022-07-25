const fs = require('fs');
// const parser = require('acorn');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

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

  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    });
    return code;
  },
}
