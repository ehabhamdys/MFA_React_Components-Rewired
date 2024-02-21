

const { ModuleFederationPlugin } = require("webpack").container;

const deps = require("./package.json").dependencies;

const {
  override,
  addWebpackPlugin,
  // addWebpackModuleRule,
} = require("customize-cra");


// Reference: https://github.com/arackaf/customize-cra/issues/170
const publicPathPlugin = (config, env) => {
  config.output = {
    publicPath: 'http://localhost:3000/',
  }
  return config
}

module.exports = {
  webpack: override(
    // usual webpack plugin
    publicPathPlugin,
    // addWebpackModuleRule({ test: /\.po$/, use: ["json-loader", "po-loader"] }),
    addWebpackPlugin(
      new ModuleFederationPlugin({
        name: "micorfrontend_app",
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          "./Header": "./src/Header.tsx",
          "./Footer": "./src/Footer.tsx",
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      })  
    )
  ),
  
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);
      // Change the dev server's config here...
      // Then return your modified config.
      config.historyApiFallback = true;
      return config;
    };
  },
};
