const path = require('path');
const fs = require('fs');
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
    const entryPath = path.basename(this.entry);
    this.buildModule(dirname, entryPath);
    console.log('module ', this.modules);
    this.emitFiles();
  }

  buildModule(dirname, filePath) {
    const absolutePath = path.join(dirname, filePath);
    const ast = getAST(absolutePath);
    const dependencies = getDependencies(ast);
    const code = transform(ast);
    const module = {
      id: filePath,
      dependencies,
      code,
    };
    this.modules.push(module);
    for (const dependency of dependencies) {
      this.buildModule(path.dirname(absolutePath), dependency);
    }
  }

  emitFiles() {
    let modules = '';
    for (const module of this.modules) {
      modules += `'${module.id}': function(module, exports, require) {${module.code}}, `;
    }
    modules = `{${modules}}`;

    const entryPath = path.basename(this.entry);
    const bundle = `(function (modules) {
      function require(moduleId) {
        var fn = modules[moduleId];
        var module = { exports: {} };
        fn(module, module.exports, require);
        return module.exports;
      }
      require('${entryPath}');
    })(${modules})`;

    console.log('source: ', bundle);

    fs.writeFileSync(path.join(this.output.path, this.output.filename), bundle, 'utf-8');
  }
};

/*
function __webpack_require__(moduleId) {
  // Check if module is in cache
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // Create a new module (and put it into the cache)
  var module = (installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {},
  });
  // Execute the module function
  modules[moduleId].call(
    module.exports,
    module,
    module.exports,
    __webpack_require__
  );
  // Flag the module as loaded
  module.l = true;
  // Return the exports of the module
  return module.exports;
}
*/
