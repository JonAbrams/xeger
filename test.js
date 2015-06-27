var xeger = require('./xeger');
var assert = require('assert');

describe('xeger', function () {
  it('literals', function () {
    var regex = xeger(function (r) {
      r.start();
      r.literal('hello');
      r.alphanumeric();
      r.number();
      r.newline();
      r.whitespace();
      r.end();
    });
    assert.equal(regex.toString(), '/^hello\\w\\d\\n\\s$/');
  });

  describe('flags', function () {
    var regex = xeger(function (r) {
      r.literal('hi');
    }, {
      global: true,
      multiline: true,
      insensitive: true
    });

    it('adds flags', function () {
      assert.equal(regex.toString(), '/hi/gim');
    });
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

    var regex2 = xeger(function (r) {
      r.any(function () {
        r.literal('A');
        r.to();
        r.literal('Z');
      });
      r.not(function () {
        r.literal('0');
        r.to();
        r.literal('9');
      })
    });

    it('makes the expected regexes', function () {
      assert.equal(regex.toString(), '/[^\\$\\%]hi.next[abc]+/');
      assert.equal(regex2.toString(), '/[A-Z][^0-9]/');
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

  describe('callback context', function () {
    var regex = xeger(function () {
      this.literal('hi');
    });

    it('works', function () {
      assert.equal(regex.toString(), '/hi/');
    });
  });

  describe('chaining', function () {
    var regex = xeger({ global: true }).start().literal('abc').any(function () {
      this.literal('A').to().literal('Z');
    }).regex();

    it('makes the expected regex', function () {
      assert.equal(regex.toString(), '/^abc[A-Z]/g');
    });
  });

  it('parses a url', function () {
    var regex = xeger(function (r) {
      r.start();
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
      r.end();
    });

    assert.equal(regex.toString(), '/^(https?)\\:\\/\\/([^\\/]+)(.+)\\?(.*)$/');

    var parsed = regex.exec('https://www.google.com/search?q=my_search');
    assert.equal(parsed[0], 'https://www.google.com/search?q=my_search');
    assert.equal(parsed[1], 'https');
    assert.equal(parsed[2], 'www.google.com');
    assert.equal(parsed[3], '/search');
    assert.equal(parsed[4], 'q=my_search');
  });
});
