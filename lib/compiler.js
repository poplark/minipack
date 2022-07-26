const path = require('path');
const { getAST, getDependencies, transform } = require('./parser');

module.exports = class Compiler {

  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }

  run() {
    const dirname = path.dirname(this.entry);
    const filePath = path.basename(this.entry);
    this.buildModule(dirname, filePath);
    console.log('module ', this.modules);
  }

  buildModule(dirname, filePath) {
    const absolutePath = path.join(dirname, filePath);
    const ast = getAST(absolutePath);
    const dependencies = getDependencies(ast);
    const code = transform(ast);
    const module = {
      moduleId: filePath,
      code,
    };
    this.modules.push(module);
    for (const dependency of dependencies) {
      this.buildModule(path.dirname(absolutePath), dependency);
    }
  }

  emitFiles() {
  }
}
