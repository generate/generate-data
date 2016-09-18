'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var generate = require('generate');
var del = require('delete');
var data = require('..');
var repo, app;

var project = path.resolve(__dirname, 'fixtures/project-no-git');
var cwd = process.cwd();

describe('generate-data (no git repository)', function() {
  before(function() {
    process.chdir(project);
  });

  after(function() {
    process.chdir(cwd);
  });

  beforeEach(function() {
    app = generate();
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
});
