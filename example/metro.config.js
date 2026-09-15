const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

// Resolve the library from ../src and make sure only ONE copy of react,
// react-native and styled-components is bundled (the example's copy).
config.watchFolders = [root];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules'), path.resolve(root, 'node_modules')];
config.resolver.extraNodeModules = {
  'rendr-components': path.resolve(root, 'src'),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react-native-web': path.resolve(__dirname, 'node_modules/react-native-web'),
  'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
};
config.resolver.blockList = [new RegExp(`${path.resolve(root, 'node_modules/react-native')}/.*`), new RegExp(`${path.resolve(root, 'node_modules/react')}/.*`)];

module.exports = config;
