const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  externals: {
    'node-fetch': 'fetch',
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    'isomorphic-fetch': 'fetch',
    '@trust/webcrypto': 'crypto',
    '@sinonjs/text-encoding': 'TextEncoder',
    'isomorphic-webcrypto': 'crypto'
  },
  node: {
    buffer: true,
    Buffer: true,
    fs: 'empty',
    tls: 'empty',
    dns: 'empty',
    net: 'empty',
    dgram: 'empty',
    child_process: 'empty'
  }
}
