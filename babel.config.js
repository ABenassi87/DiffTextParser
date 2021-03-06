module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: '> 0.25%, not dead',
        },
      ],
      ['@babel/preset-typescript', {}],
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
  };
};
