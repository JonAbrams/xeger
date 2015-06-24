var xeger = require('./xeger');
var assert = require('assert');

describe('xeger', function () {
  it('parses hello literal', function () {
    var regex = xeger(function (r) {
      r.literal('hello');
    });
    assert.equal(regex.toString(), '/hello/');
    assert.equal(regex.exec('hello')[0], 'hello');
  });

  describe('some options', function () {
    var regex = xeger(function (r) {
      r.literal('he');
      r.literal('l', { multiple: true });
      r.literal('o?');
      r.literal('!', { optional: true });
      r.literal('extra', { optional: true });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/hel+o\\?\\!?(?:extra)?/');
    });
  });

  describe('wildcards', function () {
    var regex = xeger(function (r) {
      r.not('$%');
      r.literal('hi');
      r.any();
      r.literal('next');
      r.any('abc', { multiple: true });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/[^\\$\\%]hi.next[abc]+/');
    });
  });

  describe('repeats', function () {
    var regex = xeger(function (r) {
      r.literal('h', { from: 2, to: 4 });
      r.literal('i', { from: 2 });
      r.literal('!', { repeat: 2 });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/h{2,4}i{2,}\\!{2}/');
    });
  });

  describe('groups', function () {
    var regex = xeger(function (r) {
      r.group(function (r) {
        r.any('abc');
      });
      r.group(function (r) {
        r.literal('123');
      }, { optional: true, ignore: true });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/([abc])(?:123)?/');
    });
  });

  it('parses a url', function () {
    var regex = xeger(function (r) {
      r.group(function (r) {
        r.literal('http');
        r.literal('s', { optional: true });
      });
      r.literal('://');
      r.group(function (r) {
        r.not('/', { multiple: true });
      });
      r.group(function (r) {
        r.any({ multiple: true });
      });
      r.literal('?');
      r.group(function (r) {
        r.any({ multiple: true, optional: true });
      });
    });

    assert.equal(regex.toString(), '/(https?)\\:\\/\\/([^\\/]+)(.+)\\?(.*)/');

    var parsed = regex.exec('https://www.google.com/search?q=my_search');
    assert.equal(parsed[0], 'https://www.google.com/search?q=my_search');
    assert.equal(parsed[1], 'https');
    assert.equal(parsed[2], 'www.google.com');
    assert.equal(parsed[3], '/search');
    assert.equal(parsed[4], 'q=my_search');
  });
});
