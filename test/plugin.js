'use strict';

require('mocha');
var assert = require('assert');
var generate = require('generate');
var generator = require('..');
var app;

describe('generate-data', function() {
  describe('plugin', function() {
    beforeEach(function() {
      app = generate();
    });

    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-data') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });
  });
});
