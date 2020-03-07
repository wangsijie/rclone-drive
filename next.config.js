const withLess = require('@zeit/next-less')

module.exports = () => {
  const config = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /be-modules/,
          use: "null-loader",
        })
      }
      return config
    },
  };
  return withLess(config)
}
