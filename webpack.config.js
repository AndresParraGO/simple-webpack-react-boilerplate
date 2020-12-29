const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
  const mode = env.NODE_ENV;

  let optimization = {}

  const plugins = [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ]

  if(mode === 'production') {
    plugins.push(new MiniCssExtractPlugin());
    optimization = {
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ]
    }
  }

  return {
  	entry: './src/index.js',
  	output: {
  		path: path.resolve(__dirname, 'dist'),
  		filename: 'bundle.[fullhash].js'
  	},

  	module: {
  		rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(jpg|jpeg|png|gif|svg)$/,
          use: [
            mode === 'development' 
              ? {
                  loader: 'url-loader',
                  options: {
                    limit: false
                  }
                }
              : {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]'
                  }
                }
          ]
        }
  		]
  	},

    plugins: plugins,
    optimization: optimization
  }
}