module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // limit: 100000, //单位为bit
              limit: 1000, //单位为bit
              fallback: {
                loader: "file-loader",
                options: {
                  name: "[name]-[hash].[ext]",
                  outputPath: "asset/",
                },
              },
            },
          },
        ],
      },
    ],
  },
};
