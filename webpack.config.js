module.exports = {
  // 单个入口(简写)语法
  entry: __dirname + '/src/scripts/index.js',
  // entry: {
  //     main: __dirname + '/src/scripts/index.js'
  // },
  // 数组语法
  // entry: [
  //     'src/scripts/a.js',
  //     'src/scripts/b.js'
  // ],
  // 对象语法
  // entry: {
  //     app: 'src/scripts/app.js',
  //     vendors: 'src/scripts/vendors.js'
  // },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
