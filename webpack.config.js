const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SECRET_KEY': JSON.stringify(process.env.SECRET_KEY)
    })
  ]
};
