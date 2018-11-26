const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  // entry point for webpack builder to start process with application
  entry: "./src/index.jsx",
  // development | production mode presets
  mode: "development",
  // source mappings
  devtool: 'source-map',
  // set of rules for files preprocessing with loaders
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/react"] }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: "style-loader" // creates style nodes from JS strings
                },
                {
                    loader: "css-loader" // translates CSS into CommonJS
                },
                {
                    loader: "sass-loader" // compiles Sass to CSS
                }
            ]
        }
    ]
  },
  // which file extensions will be treated as modules (can be imported)
  resolve: { extensions: ["*", ".js", ".jsx"] },
  // where to write generated files (bundle.js, etc)
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  // dev-server settings
  devServer: {
    port: 8080,
    hotOnly: true
  }, // plugins section
  plugins: [
    // clean directory before build
    new CleanWebpackPlugin(['dist']),
    // replacing modules in real time after updates
    new webpack.HotModuleReplacementPlugin()
  ]
};