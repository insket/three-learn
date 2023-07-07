const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const fs = require("fs");

const files = fs.readdirSync(__dirname).filter((item) => item.includes("-"));
const arr = [];

files.forEach((item) => {
  const itemPath = path.join(__dirname, item);
  const isDirectory = fs.statSync(itemPath).isDirectory();
  if (isDirectory) {
    arr.push(item.split("-")[0]);
  }
});
const sourcePath = files.find((item) => item.includes(Math.max(...arr)));

module.exports = {
  entry: path.resolve(__dirname, `./${sourcePath}/src/script.js`),
  output: {
    hashFunction: "xxhash64",
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "./static") }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `./${sourcePath}/src/index.html`),
      minify: true,
    }),
    new MiniCSSExtractPlugin(),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext]",
        },
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
      },
    ],
  },
};
