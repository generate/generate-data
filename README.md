# generate-data [![NPM version](https://img.shields.io/npm/v/generate-data.svg?style=flat)](https://www.npmjs.com/package/generate-data) [![NPM monthly downloads](https://img.shields.io/npm/dm/generate-data.svg?style=flat)](https://npmjs.org/package/generate-data)  [![NPM total downloads](https://img.shields.io/npm/dt/generate-data.svg?style=flat)](https://npmjs.org/package/generate-data) [![Linux Build Status](https://img.shields.io/travis/generate/generate-data.svg?style=flat&label=Travis)](https://travis-ci.org/generate/generate-data)

> Generate plugin that gathers data from the user's environment to pre-populate data for hints.

## Heads up!

This plugin modifies the `app.cache.data` object with "expanded" values. For example, the following `author` property from package.json:

```js
{
  author: 'Jon Schlinkert (https://github.com/jonschlinkert)'
}
```

Is expanded to:

```js
{
  author: {
    name: 'Jon Schlinkert',
    url: 'https://github.com/jonschlinkert'
  }
}
```

**"original" data**

Before data is modified, it's cloned and set on the `app.cache.originalData` object. You can reset the data object to this value by doing something like the following:

```js
app.cache.data = app.cache.originalData;
```

## Usage

Use as a plugin inside your [generate](https://github.com/generate/generate) generator:

```js
module.exports = function(app) {
  app.use(require('generate-data'));
};
```

## About

### Related projects

* [generate-generator](https://www.npmjs.com/package/generate-generator): Generate a generate generator project, complete with unit tests. | [homepage](https://github.com/generate/generate-generator "Generate a generate generator project, complete with unit tests.")
* [generate-license](https://www.npmjs.com/package/generate-license): Generate a license file for a GitHub project. | [homepage](https://github.com/generate/generate-license "Generate a license file for a GitHub project.")
* [generate-package](https://www.npmjs.com/package/generate-package): Generate a package.json from a pre-defined or user-defined template. This generator can be used from… [more](https://github.com/generate/generate-package) | [homepage](https://github.com/generate/generate-package "Generate a package.json from a pre-defined or user-defined template. This generator can be used from the command line when globally installed, or as a plugin or sub-generator in your own generator.")
* [generate-project](https://www.npmjs.com/package/generate-project): Scaffold out complete code projects from the command line, or use this generator as a… [more](https://github.com/generate/generate-project) | [homepage](https://github.com/generate/generate-project "Scaffold out complete code projects from the command line, or use this generator as a plugin in other generators to provide baseline functionality.")
* [generate](https://www.npmjs.com/package/generate): Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the robustness and configurability of Yeoman, the expressiveness and simplicity of Slush, and more powerful flow control and composability than either.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Running tests

Install dev dependencies:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.1, on January 27, 2017._