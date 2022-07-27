const { RawSource } = require('webpack-sources');
module.exports = class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { name } = this.options;
    compiler.hooks.compilation.tap('my-plugin', (compilation) => {
      const source = new RawSource('demo');
      compilation.emitAsset(`${name}.raw`, source);
      compilation.hooks.processAssets.tap('my-plugin', (assets) => {
        assets[`${name}.txt`] = source;
      });
    });
  }
}
