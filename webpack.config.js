// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Подгружаем .env.development или .env.production
require("dotenv").config({
  path: path.join(
    process.cwd(),
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
  ),
});

const isProduction = process.env.NODE_ENV === "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true, // очищаем dist перед сборкой
  },
  // В деве — source-map, в проде — без карт
  devtool: isProduction ? false : "source-map",
  devServer: {
    open: true,
    host: "localhost",
    hot: true,
    watchFiles: ["src/pages/*.html"],
    proxy: {
      // проксируем /api → реальный API_ORIGIN
      "/api": {
        target: process.env.API_ORIGIN,
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      // проксируем /content → реальный CDN-путь
      "/content": {
        target: process.env.API_ORIGIN,
        changeOrigin: true,
        pathRewrite: { "^/content": "/content" },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html",
    }),
    new MiniCssExtractPlugin(),
    new DefinePlugin({
      // В деве — только относительные пути для прокси,
      // в проде — абсолютные URL, подставленные из API_ORIGIN
      "process.env.API_PATH": JSON.stringify(
        isProduction ? `${process.env.API_ORIGIN}/api` : "/api"
      ),
      "process.env.CDN_PATH": JSON.stringify(
        isProduction ? `${process.env.API_ORIGIN}/content` : "/content"
      ),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/images", to: "images" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = () => {
  // Устанавливаем режим сборки
  config.mode = isProduction ? "production" : "development";
  return config;
};
