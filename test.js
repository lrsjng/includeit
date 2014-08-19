/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
    _ = require('lodash'),
    includeit = require('./');


describe('includeit()', function () {

    it('is function', function () {

        assert.ok(_.isFunction(includeit));
    });

    it('expects 1 parameter', function () {

        assert.strictEqual(includeit.length, 1);
    });
});
