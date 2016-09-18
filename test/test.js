'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var generate = require('generate');
var del = require('delete');
var data = require('..');
var repo, app, cache;

var project = path.resolve(__dirname, 'fixtures/project');
var cwd = process.cwd();

describe('generate-data', function() {
  before(function(cb) {
    process.chdir(project);
    repo = gitty(process.cwd());
    repo.initSync();
    repo.addSync(['.']);
    repo.commitSync('first commit');
    cb();
  });

  after(function(cb) {
    process.chdir(cwd);
    del(project + '/.git', cb);
  });

  beforeEach(function() {
    app = generate();
    cache = app.store.data;
    app.store.data = {};
    app.store.save();
  });

  afterEach(function() {
    app.store.set(cache);
  });

  describe('data', function() {
    it('should add package.json data to the instance', function() {
      app.use(data);
      assert.equal(app.cache.data.name, 'test-project');
    });

    it('should work with extendWith', function() {
      app.extendWith(data);
      assert.equal(app.cache.data.name, 'test-project');
    });

    it('should add a `runner` property with generate pkg data', function() {
      app.use(data);
      assert(app.cache.data.runner);
      assert.equal(app.cache.data.runner.name, 'generate');
    });
  });

  describe('clonedData', function() {
    it('should clone original, unmodified data before updating it', function() {
      app.use(data);
      assert(app.has('cache.originalData'));
    });

    it('should clone data after updating it', function() {
      app.use(data);
      assert(app.has('cache.modifiedData'));
    });
  });

  describe('generator', function() {
    it('should add data to a generator', function(cb) {
      app.use(data);

      app.generator('foo', function(foo) {
        assert(foo.cache.data.runner);
        assert.equal(foo.cache.data.runner.name, 'generate');
        cb();
      });
    });

    it('should add data from a generator to a sub-generator', function(cb) {
      app.generator('foo', function(foo) {
        foo.use(data);

        foo.generator('bar', function(bar) {
          assert(bar.cache.data.runner);
          assert.equal(bar.cache.data.runner.name, 'generate');
          cb();
        });
      });
    });

    it('should add data to a sub-generator', function(cb) {
      app.generator('foo', function(foo) {
        foo.generator('bar', function(bar) {
          bar.use(data);
          assert(bar.cache.data.runner);
          assert.equal(bar.cache.data.runner.name, 'generate');
          cb();
        });
      });
    });

    it('should extend to a nested sub-generator', function(cb) {
      app.use(data);

      app.generator('foo', function(foo) {
        foo.generator('bar', function(bar) {
          bar.generator('baz', function(baz) {
            assert(baz.cache.data.runner);
            assert.equal(baz.cache.data.runner.name, 'generate');
            cb();
          });
        });
      });
    });
  });

  describe('context', function() {
    beforeEach(function(cb) {
      app.use(data);
      cb();
    });

    it('should add data to the context', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        var ctx = app.cache.data;
        assert.equal(ctx.year, new Date().getFullYear());
        assert.equal(ctx.license, 'MIT');
        assert.equal(ctx.author.url, 'https://github.com/jonschlinkert');
        assert.equal(ctx.repository, 'jonschlinkert/test-project');
        assert.equal(ctx.username, 'jonschlinkert');
        assert.equal(ctx.owner, 'jonschlinkert');
        cb();
      });
    });

    it('should get runner', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.runner.homepage, 'https://github.com/generate/generate');
        cb();
      });
    });

    it('should set runner', function(cb) {
      app.data('runner', {
        name: 'xyz',
        homepage: 'https://github.com/abc/xyz'
      });

      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.runner.name, 'xyz');
        assert.equal(app.cache.data.runner.homepage, 'https://github.com/abc/xyz');
        cb();
      });
    });

    it('should set alias', function(cb) {
      app.data('alias', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.alias, 'xyz');
        cb();
      });
    });

    it('should set varname', function(cb) {
      app.data('varname', 'xyz');
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.varname, 'xyz');
        cb();
      });
    });

    it('should get varname', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.varname, 'testProject');
        cb();
      });
    });

    it('should support a custom `options.toAlias` function', function(cb) {
      app = generate();
      app.option('toAlias', function toAlias() {
        return 'blah';
      });
      app.use(data);

      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.alias, 'blah');
        cb();
      });
    });
  });

  describe('twitter (username)', function() {
    beforeEach(function(cb) {
      app.use(data);
      cb();
    });

    it('should get `twitter` value from username', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.twitter, 'jonschlinkert');
        cb();
      });
    });
  });

  describe('twitter (data)', function() {
    beforeEach(function(cb) {
      app.data({twitter: 'doowb'})
      app.use(data);
      cb();
    });

    it('should use `twitter` value on app.cache.data', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.twitter, 'doowb');
        cb();
      });
    });

    it('should support updating `twitter` value on `app.cache.data`', function(cb) {
      app.data({twitter: 'slsllsl'});

      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.twitter, 'slsllsl');
        cb();
      });
    });
  });

  describe('twitter (options)', function() {
    beforeEach(function(cb) {
      app.option('twitter', 'foobar');
      app.use(data);
      cb();
    });

    it('should support passing `twitter` value on options', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.twitter, 'foobar');
        cb();
      });
    });
  });

  describe('license', function() {
    beforeEach(function(cb) {
      app.option('license', 'MIT');
      app.use(data);
      cb();
    });

    it('should support passing `license` value on options', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.license, 'MIT');
        cb();
      });
    });

    it('should support passing `twitter` value on `app.cache.data`', function(cb) {
      app.data({twitter: 'jonschlinkert'});

      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.twitter, 'jonschlinkert');
        cb();
      });
    });
  });

  describe('context (no license)', function() {
    var cwd = process.cwd();
    beforeEach(function(cb) {
      process.chdir(path.resolve(__dirname, 'fixtures/project-no-license'));
      app.use(data);
      cb();
    });

    afterEach(function(cb) {
      process.chdir(cwd);
      cb();
    });

    it('should add data to the context', function(cb) {
      render(app, function(err) {
        if (err) return cb(err);
        var ctx = app.cache.data;
        assert.equal(ctx.year, new Date().getFullYear());
        assert.equal(ctx.author.url, 'https://github.com/jonschlinkert');
        assert.equal(ctx.license, 'MIT');
        assert.equal(ctx.repository, 'jonschlinkert/test-project');
        assert.equal(ctx.username, 'jonschlinkert');
        assert.equal(ctx.owner, 'jonschlinkert');
        cb();
      });
    });

    it('should support a custom `options.toAlias` function', function(cb) {
      app = generate();
      app.option('toAlias', function toAlias() {
        return 'blah';
      });
      app.use(data);

      render(app, function(err) {
        if (err) return cb(err);
        assert.equal(app.cache.data.alias, 'blah');
        cb();
      });
    });
  });
});

function render(app, cb) {
  if (!app.tests) {
    app.engine('*', require('engine-base'));
    app.create('tests');
    app.test('foo.md', {content: 'this is foo'});
  }

  app.toStream('tests')
    .pipe(app.renderFile('*'))
    .on('error', cb)
    .pipe(app.dest('test/actual'))
    .on('error', cb)
    .on('end', cb);
}
