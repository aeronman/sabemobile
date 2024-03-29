const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

module.exports = async () => {
  const baseConfig = getDefaultConfig(__dirname);

  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return mergeConfig(baseConfig, {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  });
};
