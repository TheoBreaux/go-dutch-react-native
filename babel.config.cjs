// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: ["module:metro-react-native-babel-preset", "babel-preset-expo"],
//     plugins: ["react-native-reanimated/plugin"],
//   };
// };

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["@react-native/babel-preset"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
