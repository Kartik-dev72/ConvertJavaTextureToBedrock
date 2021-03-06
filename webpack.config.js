const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OfflinePlugin = require("offline-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PACKAGE = require("./package.json");
const TerserJSPlugin = require("terser-webpack-plugin");

const isDebug = (process.env.NODE_ENV === "development");

module.exports = {
    devServer: {
        disableHostCheck: true,
        host: "127.0.0.1",
        open: true,
        port: 8080
    },
    devtool: false,
    entry: {
        index: "./src/html/index.js"
    },
    mode: (isDebug ? "development" : "production"),
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /worker\.js$/,
                loader: "worker-loader",
                options: {
                    name: "[name].[contenthash].[ext]"
                }
            }
        ]
    },
    optimization: {
        minimizer: (isDebug ? [] : [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin()]),
    },
    output: {
        filename: "[name].[contenthash].js",
        path: __dirname + "/build",
        libraryTarget: "umd"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: (isDebug ? false : {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }),
            template: "./src/html/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new FaviconsWebpackPlugin({
            devMode: "webapp",
            logo: "./src/img/icon.svg",
            mode: "webapp",
            favicons: {
                appDescription: PACKAGE.description,
                appName: PACKAGE.productName,
                appShortName: PACKAGE.productName,
                appleStatusBarStyle: "black",
                background: "#FFFFFF",
                developerName: PACKAGE.author,
                developerURL: null,
                dir: null,
                display: "standalone",
                icons: {
                    android: true,
                    appleIcon: true,
                    favicons: true,
                    appleStartup: false,
                    coast: false,
                    firefox: false,
                    windows: false,
                    yandex: false
                },
                lang: null,
                manifestRelativePaths: true,
                orientation: "any",
                path: "./",
                start_url: "..",
                theme_color: "#795548",
                version: PACKAGE.version
            },
            prefix: "webapp",
            publicPath: "./"
        }),
        ...(!isDebug ? [new OfflinePlugin({
            ServiceWorker: {
                events: true
            },
            version: PACKAGE.version
        })] : [])
    ],
    target: "web"
};
