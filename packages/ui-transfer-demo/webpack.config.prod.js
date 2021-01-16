const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  plugins: [new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|svg)$/,
      compressionOptions: {
        level: 11,
      },
      threshold: 8192,
      minRatio: 0.8,
    })
  ],
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
