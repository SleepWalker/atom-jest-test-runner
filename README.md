# Atom Jest Test Runner
[![Build Status](https://travis-ci.org/SleepWalker/atom-jest-test-runner.svg?branch=master)](https://travis-ci.org/SleepWalker/atom-jest-test-runner)
[![Build status](https://ci.appveyor.com/api/projects/status/4f3ccj7mpr6fehq7/branch/master?svg=true)](https://ci.appveyor.com/project/SleepWalker/atom-jest-test-runner/branch/master)
[![Dependency Status](https://david-dm.org/SleepWalker/atom-jest-test-runner.svg)](https://david-dm.org/SleepWalker/atom-jest-test-runner)

This package allows you to use [jest](https://facebook.github.io/jest/) to run your atom's extension tests.

## Installation

```
$ apm install --save-dev atom-jest-test-runner
```

## Usage

Simply add `atomTestRunner` field in you `package.json`:

```javascript
{
  "name": "hello-world",
  // ...
  "atomTestRunner": "atom-jest-test-runner"
}
```

then simply run:

```
$ atom --test test
```

### Watch mode

You can also run tests in watch mode, while developing a package. Because the jest will be executed by separate process, you won't be able to pass cli options directly, so you need to use env variables for that:

```
$ TEST_MODE='watch' atom --test test
```

### Example

This package uses itself to test itself :D So you can browse current repository to see how it was set up.
