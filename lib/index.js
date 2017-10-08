'use babel';

import { runCLI } from 'jest-cli';

export default function runTests({
  buildAtomEnvironment,
  buildDefaultApplicationDelegate,
  logFile,
  testPaths
}) {
  const applicationDelegate = buildDefaultApplicationDelegate();
  const atom = buildAtomEnvironment({
    applicationDelegate,
    window,
    document: window.document,
    configDirPath: process.env.ATOM_HOME,
    enablePersistence: false
  });

  global.atom = atom;

  return runCLI(
    {
      // force workers > 1 and disabling cache
      // without this it will fail on oniguruma package
      // @see https://github.com/facebook/jest/issues/3552
      cache: false,
      maxWorkers: 2,
      watch: process.env.TEST_MODE === 'watch',
      _: testPaths,
      outputFile: logFile
    },
    [process.cwd()]
  ).then(resp => (resp.results.success ? 0 : 1));
}
