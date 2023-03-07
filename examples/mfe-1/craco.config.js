const Path = require('path')
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const isProd = env === 'production'
      if (isProd) {
        const buildSSR = Boolean(process.env.SSR)
        console.log({ buildSSR });
      //  webpackConfig.entry = buildSSR ? "./src/entry-server.tsx" : "./src/entry-client.tsx";
        webpackConfig.entry = ["./src/entry-client.tsx", "./src/entry-server.tsx"]

        // const newOutputPath = Path.join(webpackConfig.output.path, (buildSSR ? 'server' : 'client'))

        // console.log({ newOutputPath})

        // webpackConfig.output = {
        //   ...webpackConfig.output,
        //   path: newOutputPath 
        // }
      }

      webpackConfig.externals = {
        'react': 'react',
        'react-dom': 'react-dom'
      };
      return webpackConfig;
    },
  },
};
