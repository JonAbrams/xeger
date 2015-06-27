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

### xeger([function], [options])

Call this to start the construction of the regex, passing in a callback function. It returns a RegExp object.

Use the rest of the functions in this section (the *rule* functions) to construct a regex by calling them within the callback.

The callback function will be called with one parameter, the xeger object. The rest of the functions here should be called on the xeger object. The callback is also called with the xeger object assigned to `this`.

The options object passed here is different from the options object used in the rest of the API. This one takes the following keys:

- **global**: [boolean] - Will attempt to match the regex multiple times.
- **multiline**: [boolean] - Will attempt to match the regex multiple times.
- **insensitive**: [boolean] - Case insensitive matching.

### x.literal([string], [options])

Matches the exact string passed in. `x.literal` will escape any non-alpha numeric character.

```javascript
xeger(function (x) {
  x.literal('exact?!');
}); /* returns /exact\?\!/ to the regex */
```

### x.any([string|function|optional], [options])

Without a parameter, will match any single character. If you pass in a string, it's match any of the characters in the string.

```javascript
xeger(function (x) {
  x.literal('abc');
  x.any();
  x.literal('123');
}); /* returns /abc.123/ */
```

```javascript
xeger(function (x) {
  x.any('abc');
  x.any(function () {
    x.literal('A');
    x.to();
    x.literal('Z');
  });
}); /* returns /[abc][A-Z]/ */
```

### x.not([string|function], [options])

The inverse of `any`. Creates a set of characters to not match against.

```javascript
xeger(function (x) {
  x.literal('abc');
  x.not('xyz');
  x.not(function () {
    x.literal('0');
    x.to();
    x.literal('9');
  });
}); /* returns /abc[^xyz][^0-9]/ */
```

### x.to()

Used to create the '-' inside *any* and *not* functions (see examples for *any* and *not*).

If you were to just do `x.any('A-Z')` the `-` would be escaped: `/[A\-Z]/`

See the "Chaining" section below for a different syntax that makes using `.to()` less clunky.

### x.alphanumeric([options])

Matches any single alpha-numeric character (includes letters, numbers, and the underscore).

```javascript
xeger(function (x) {
  x.alphanumeric();
}); /* returns /\w/ */
```

### x.number([options])

Matches a single number character.

```javascript
xeger(function (x) {
  x.number();
}); /* returns /\w/ */
```

### x.whitespace([options])

Matches a white-space character (e.g. tab, newline, and space)

```javascript
xeger(function (x) {
  x.whitespace();
}); /* returns /\s/ */
```

### x.newline([options])

Matches a newline character

```javascript
xeger(function (x) {
  x.newline();
}); /* returns /\n/ */
```

### x.start()

Matches the start of the string.

```javascript
xeger(function (x) {
  x.start();
  x.literal('hi');
}); /* returns /^hi/ */
```

### x.end()

Matches the end of the string.

```javascript
xeger(function (x) {
  x.start();
  x.literal('hi');
  x.end();
}); /* returns /^hi$/ */
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

### Options

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

### Chaining, and `this`

Xeger offers a few alternative ways to construct a regex.

#### Chaining

Each rule function returns a copy of Xeger object, allowing you to chain rule calls.

```javascript
xeger(function (x) {
  x.any(function () {
    x.literal('A').to().literal('Z');
  });
}); /* Returns /[A-Z]/ */
```

If you call `xeger()` without giving it a callback function, it will return a fresh Xeger object, allowing you to chain calls. In this case, call `.regex()` at the end to get the final RegExp object out of it.

```javascript
xeger().start().any(function () {
  x.literal('A').to().literal('Z');
}).regex(); /* Returns /[A-Z]/ */
```

#### this and @

Instead of relying on the `x` parameter given to each rule callback, you can use the `this` object. This is handy if using CoffeeScript (which has the `@` shorthand to represent `this.`):

```coffeescript
xeger ->
  @any ->
    @literal('a').to().literal('z')
# Returns /[a-z]/
```
