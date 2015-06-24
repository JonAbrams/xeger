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

/* Instead of this */
var boringRegex= /(https?)\:\/\/([^\/]+)(.+)\?(.*)/;

/* Write this! */
var coolRegex = rekt(function (r) {
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

var matched = coolRegex.exec('https://www.google.com/search?q=my_search');
```
matched:
```javascript
[ 'https://www.google.com/search?q=my_search',
  'https',
  'www.google.com',
  '/search',
  'q=my_search',
  index: 0,
  input: 'https://www.google.com/search?q=my_search' ]
```
