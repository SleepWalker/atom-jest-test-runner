'use babel';

import runTests from '../lib';
import { runCLI } from 'jest-cli';

jest.mock('jest-cli');

beforeEach(() => {
  delete process.env.TEST_MODE;
  delete global.atom;
});

it('should resolve with 0 if tests passed', () => {
  const promise = Promise.resolve({
    results: {
      success: true
    }
  });
  const testPaths = ['test'];
  const logFile = 'some-file.log';

  runCLI.mockReturnValue(promise);

  return runTests({
    testPaths,
    logFile,
    buildAtomEnvironment() {},
    buildDefaultApplicationDelegate() {}
  }).then(code => {
    expect(runCLI).toBeCalledWith(
      {
        cache: false,
        maxWorkers: 2,
        watch: false,
        _: testPaths,
        outputFile: logFile
      },
      [process.cwd()]
    );
    expect(code).toBe(0);
  });
});

it('should resolve with 1 if tests failed', () => {
  const promise = Promise.resolve({
    results: {
      success: false
    }
  });
  const testPaths = ['test'];
  let logFile;

  runCLI.mockReturnValue(promise);

  return runTests({
    testPaths,
    logFile,
    buildAtomEnvironment() {},
    buildDefaultApplicationDelegate() {}
  }).then(code => {
    expect(runCLI).toBeCalledWith(
      {
        cache: false,
        maxWorkers: 2,
        watch: false,
        _: testPaths,
        outputFile: logFile
      },
      [process.cwd()]
    );
    expect(code).toBe(1);
  });
});

it('should support TEST_MODE=watch', () => {
  const promise = Promise.resolve({
    results: {
      success: true
    }
  });
  const testPaths = ['test'];
  const logFile = 'some-file.log';
  process.env.TEST_MODE = 'watch';

  runCLI.mockReturnValue(promise);

  return runTests({
    testPaths,
    logFile,
    buildAtomEnvironment() {},
    buildDefaultApplicationDelegate() {}
  }).then(code => {
    expect(runCLI).toBeCalledWith(
      {
        cache: false,
        maxWorkers: 2,
        watch: true,
        _: testPaths,
        outputFile: logFile
      },
      [process.cwd()]
    );
    expect(code).toBe(0);
  });
});

it('should define global atom variable', () => {
  const promise = Promise.resolve({
    results: {
      success: true
    }
  });
  const applicationDelegate = {};
  const atomInstance = {};
  const buildDefaultApplicationDelegate = jest
    .fn()
    .mockReturnValue(applicationDelegate);
  const buildAtomEnvironment = jest.fn().mockReturnValue(atomInstance);

  runCLI.mockReturnValue(promise);

  expect(global.atom).not.toBeDefined();

  return runTests({
    buildDefaultApplicationDelegate,
    buildAtomEnvironment
  }).then(() => {
    expect(buildDefaultApplicationDelegate).toBeCalled();
    expect(buildAtomEnvironment).toBeCalledWith({
      applicationDelegate,
      window,
      document: window.document,
      configDirPath: process.env.ATOM_HOME,
      enablePersistence: false
    });

    expect(atom).toBe(atomInstance);
  });
});
