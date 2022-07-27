const path = require('path');
const MyPlugin = require('./plugin/my-plugin');

module.exports = {
  mode: 'none',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new MyPlugin({
      name: 'maomao'
    })
  ]
}
