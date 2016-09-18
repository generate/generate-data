'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var gitty = require('gitty');
var generate = require('generate');
var del = require('delete');
var data = require('..');
var repo, app;

var project = path.resolve(__dirname, 'fixtures/project-empty');
var cwd = process.cwd();

describe('generate-data (empty)', function() {
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
    it('should get the project name from the directory when no package.json exists', function() {
      app.use(data);
      assert.equal(app.cache.data.name, 'project-empty');
    });

    it('should work with extendWith', function() {
      app.extendWith(data);
      assert.equal(app.cache.data.name, 'project-empty');
    });

    it('should add a `runner` property with generate pkg data', function() {
      app.use(data);
      assert(app.cache.data.runner);
      assert.equal(app.cache.data.runner.name, 'generate');
    });
  });
});
