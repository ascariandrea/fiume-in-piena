const { configPaths } = require("react-app-rewire-alias");
const { aliasDangerous } = require("react-app-rewire-alias/lib/aliasDangerous");
const { pipe } = require("fp-ts/lib/pipeable");
const R = require("fp-ts/lib/Record");
const path = require("path");

module.exports = function override(config) {
  const corePaths = pipe(
    configPaths("../../packages/@econnessione/core/tsconfig.json"),
    R.map((p) => path.resolve("../../packages/@econnessione/core/src", p))
  );
  const sharedPaths = pipe(
    configPaths("../../packages/@econnessione/shared/tsconfig.json"),
    R.map((p) => path.resolve("../../packages/@econnessione/shared/src", p))
  );
  const webPaths = pipe(
    configPaths("tsconfig.paths.json"),
    R.map((p) => path.resolve("./src", p))
  );

  const paths = {
    ...corePaths,
    ...sharedPaths,
    ...webPaths,
  };

  aliasDangerous(paths)(config);
  return config;
};
