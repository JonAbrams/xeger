# Xeger

More expressive regular expressions for JavaScript.

Pronounced "zeeger"

[![Build Status](https://travis-ci.org/JonAbrams/xeger.svg)](https://travis-ci.org/JonAbrams/xeger)

## Install

Use npm. If you're targeting the browser, use Browserify.
```
npm install xeger
```

## Usage

```javascript
var xeger = require('xeger');

/* Parsing a URL. Getting the schema, host, path, and url params */

/* Instead of this */
var boringRegex= /(https?)\:\/\/([^\/]+)(.+)\?(.*)/;

/* Write this! */
var coolRegex = xeger(function (x) {
  /* schema */
  x.group(function (x) {
    x.literal('http');
    x.literal('s', { optional: true });
  });
  x.literal('://');
  /* host */
  x.group(function (x) {
    x.not('/', { multiple: true });
  });
  /* path */
  x.group(function (x) {
    x.any({ multiple: true });
  });
  x.literal('?');
  /* query params */
  x.group(function (x) {
    x.any({ multiple: true, optional: true });
  });
});

var matched = coolRegex.exec('https://www.google.com/search?q=my_search');
```

matched:

```javascript
[ 'https://www.google.com/search?q=my_search',
  'https',          /* schema       */
  'www.google.com', /* host         */
  '/search',        /* path         */
  'q=my_search',    /* query params */
  index: 0,
  input: 'https://www.google.com/search?q=my_search' ]
```

## API

### xeger([function])

Call this to start the construction of the regex, passing in a callback function. It returns a RegExp object.

Use the rest of the functions in this section (the *rule* functions) to construct a regex by calling them within the callback.

The callback function will be called with one parameter, the xeger object. The rest of the functions here should be called on the xeger object. The callback is also called with the xeger object assigned to `this`.

### x.literal([string], [options])

Matches the exact string passed in. `x.literal` will escape any non-alpha numeric character.

```javascript
xeger(function (x) {
  x.literal('exact?!');
}); /* returns /exact\?\!/ to the regex */
```

### x.any([string|optional], [options])

Without a parameter, will match any single character. If you pass in a string, it's match any of the characters in the string.

```javascript
xeger(function (x) {
  x.literal('abc');
  x.any();
  x.literal('123');
}); /* returns /abc.123/
```

```javascript
xeger(function (x) {
  x.any('abc');
  x.any('123');
}); /* returns /[abc][123]/ */
```

### x.not([string], [options])

The inverse of `any`. Creates a set of characters to not match against.

```javascript
xeger(function (x) {
  x.literal('abc');
  x.not('xyz');
  x.any('123');
}); /* returns /abc[^xyz][123]/ */
```

### x.group([function], [options])

Creates a capture group for all the rules declared within the passed in callback function.

Use the ignore option to create a non-capture group.

```javascript
xeger(function (x) {
  x.group(function () {
    x.literal('abc');
  });
  x.group(function (x) {
    x.any('123');
  }, { ignore: true });
});  /* returns /(abc)(?:[123])/ */
```

### options

You can pass in a few options to the above rule functions.

- **multiple**: [boolean] - Will try to continuously apply the rule.
- **optional**: [boolean] - Will try to match but will skip over if it cannot match.
- **repeat**: [integer] - Applies the specified rule the specified number of times.
- **from**: [integer] - Similar to **repeat**, but specifies the minimum.
- **to**: [integer] - Similar to **from**, but specifies the maximum. Often used with **from**.

```javascript
xeger(function (x) {
  x.literal('a', { optional: true });
  x.any({ multiple: true, optional: true);
  x.literal('123', { multiple: true });
  x.literal('!', { from: 2, to: 3 });
  x.literal('$', { repeat: 5 });
}); /* returns /a?.*(?:123)+\!{2,3}\${5}/ */
```
