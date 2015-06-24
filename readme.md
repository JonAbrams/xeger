# Rekt

More expressive regular expressions for JavaScript.

[![Build Status](https://travis-ci.org/JonAbrams/rekt.svg)](https://travis-ci.org/JonAbrams/rekt)

## Install

```
npm install rekt
```

## Usage

```javascript
var rekt = require('rekt');

/* Parsing a URL */

/* Instead of this */
var boringRegex= /(https?)\:\/\/([^\/]+)(.+)\?(.*)/;

/* Write this! */
var coolRegex = rekt(function (r) {
  /* schema */
  r.group(function (r) {
    r.literal('http');
    r.literal('s', { optional: true });
  });
  r.literal('://');
  /* host */
  r.group(function (r) {
    r.not('/', { multiple: true });
  });
  /* path */
  r.group(function (r) {
    r.any({ multiple: true });
  });
  r.literal('?');
  /* query params */
  r.group(function (r) {
    r.any({ multiple: true, optional: true });
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
