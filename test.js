var rekt = require('./rekt');
var assert = require('assert');

describe('rekt', function () {
  it('parses hello literal', function () {
    var regex = rekt(function (r) {
      r.literal('hello');
    });
    assert.equal(regex.toString(), '/hello/');
    assert.equal(regex.exec('hello')[0], 'hello');
  });

  describe('some options', function () {
    var regex = rekt(function (r) {
      r.literal('he');
      r.literal('l', { multiple: true });
      r.literal('o?');
      r.literal('!', { optional: true });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/hel+o\\?\\!?/');
    });
  });

  describe('wildcards', function () {
    var regex = rekt(function (r) {
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
    var regex = rekt(function (r) {
      r.literal('h', { from: 2, to: 4 });
      r.literal('i', { from: 2 });
      r.literal('!', { repeat: 2 });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/h{2,4}i{2,}\\!{2}/');
    });
  });

  describe('groups', function () {
    var regex = rekt(function (r) {
      r.group(function (r) {
        r.any('abc');
      });
      r.group(function (r) {
        r.literal('123');
      }, { optional: true });
    });

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/([abc])(123)?/');
    });
  });

  it.skip('parses a url', function () {
    var regex = rekt(function (r) {
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

    assert(regex.toString() === '/(https?):\\/\\/([^\\/]+)(.+)\\?(.*)/');

    var parsed = regex.exec('https://www.google.com/search?q=my_search');
    assert(parsed[0] === 'https://www.google.com/search?q=my_search');
    assert(parsed[1] === 'https');
    assert(parsed[2] === 'www.google.com');
    assert(parsed[3] === '/search');
    assert(parsed[4] === 'q=my_search');
  });
});
