const path = require('path');
const fs = require('fs');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const noop = require('noop-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const nodeExternals = require('webpack-node-externals');
// For historyApiFallback:
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

// Read in package.json:
const packageJSON = JSON.parse(fs.readFileSync(path.join('.', 'package.json')));

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const isTest = nodeEnv === 'test' || nodeEnv === 'coverage';
// const isCover = nodeEnv === 'coverage';

// Extract PUBLIC_URL from either CLI or package.json:
const PUBLIC_URL = process.env.PUBLIC_URL || (
  isProd
  && Object.prototype.hasOwnProperty.call(packageJSON, 'homepage')
) ? packageJSON.homepage : undefined;
// Extract APP_TITLE from package.json:
const APP_TITLE = (
  Object.prototype.hasOwnProperty.call(packageJSON, 'title')
) ? packageJSON.title : 'My Sample App';
const publicPath = PUBLIC_URL ? url.parse(PUBLIC_URL).pathname : '';

const postCSSplugins = () => [
  require('autoprefixer')({ browsers: 'last 3 versions' }), // eslint-disable-line global-require
  require('postcss-easings'), // eslint-disable-line global-require
  require('css-mqpacker'), // eslint-disable-line global-require
  require('postcss-clearfix'), // eslint-disable-line global-require
];

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd
    ? 'hidden-source-map'
    : 'cheap-module-source-map',
  entry: {
    js: [
      'index',
    ],
  },
  output: {
    path: path.resolve('./build/'),
    filename: isProd ? 'bundle.[hash].js' : 'bundle.js',
    publicPath,
    libraryTarget: isProd ? 'umd' : 'var',
    // use absolute paths in sourcemaps (important for debugging via IDE)
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  module: {
    rules: [
      isTest ? {
        test: /\.js$/,
        include: path.resolve('./app'),
        use: 'istanbul-instrumenter-loader',
      } : {},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.vue/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader',
          options: {
            optimizeSSR: false,
          },
        },
      }, /*
        CSS loader for the module files (in
        app/stylesheets/components). These are intended to be
        styles for individual React components, which will have a
        unique name space.
      */
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              {
                /* CSS Modules Code */
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCSSplugins,
                },
              },
            ],
          }, {
            use: [
              isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCSSplugins,
                },
              },
            ],
          },
        ],
      }, /*
        SASS loader code for the module files (in
        app/stylesheets/components). These are intended to be
        styles for individual React components, which will have a
        unique name space.
      */
      {
        test: /\.(?:scss|sass)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              {
                /* CSS Modules Code */
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 2,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCSSplugins,
                },
              },
              'sass-loader',
            ],
          }, {
            use: [
              isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCSSplugins,
                },
              },
              'sass-loader',
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
    }),
    // Build the HTML file without having to include it in the app:
    new HtmlWebpackPlugin({
      title: APP_TITLE,
      template: path.join('.', 'app', 'template', 'index.html'),
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: isProd,
        collapseInlineTagWhitespace: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
      },
    }),
    // Configure SASS:
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      options: {
        context: __dirname,
        sassLoader: {
          includePaths: [
            './node_modules',
            './bower_components',
            './app/stylesheets',
          ],
        },
      },
    }),
    // Define global variables:
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
      APP_TITLE: JSON.stringify(APP_TITLE),
      PUBLIC_URL: JSON.stringify(PUBLIC_URL),
    }),
    // Optimization & Build Plugins:
    isProd ? new webpack.optimize.AggressiveMergingPlugin() : noop(),
    isProd ? new webpack.optimize.OccurrenceOrderPlugin() : noop(),
  ],
  // Recommended Webpack optimizations:,
  optimization: {
    noEmitOnErrors: !isProd,
    concatenateModules: isProd,
    namedModules: !isProd,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            inline: false,
          },
          output: {
            comments: false,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    // Load all CSS files into one file:
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    modules: [
      path.resolve('./app/'),
      path.resolve('./node_modules'),
    ],
  },
  serve: {
    content: './app',
    hot: !isProd && !isTest,
    // For historyApiFallback:
    add: (app) => {
      app.use(convert(history({})));
    },
  },
  externals: isTest ? [nodeExternals({
    whitelist: ['vue'],
  })] : [],
  target: isTest ? 'node' : 'web',
};

module.exports = webpackConfig;
