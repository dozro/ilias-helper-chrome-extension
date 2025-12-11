const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const gplHeader = fs.readFileSync("./GPLV3FileHeader", "utf8");

module.exports = {
  mode: "production",
  target: "webworker",
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  entry: {
    background: "./src/background/background.ts",
    content: "./src/content/content.ts",
    styling: "./src/styling/styling.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
          { loader: "ts-loader" }, // TS -> JS, then Babel
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "manifest.json",
          to: "",
        },
        {
          from: "images",
          to: "images",
        },
        {
          from: "LICENSE",
          to: "",
        },
      ],
    }),
    new webpack.BannerPlugin({
      banner:
        "// fullhash:[fullhash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]\n",
      raw: true,
      entryOnly: false,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
    }),
  ],
  output: {
    environment: {
      arrowFunction: false,
      globalThis: false,
      importMetaDirnameAndFilename: false,
      document: true,
      dynamicImport: false,
      dynamicImportInWorker: false,
    },
  },
  optimization: {
    minimize: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {},
      }),
    ],
    realContentHash: true,
  },
  externalsType: "window",
};
