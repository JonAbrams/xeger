var Rekt = function (cb) {
  this.regexStr = '';

  cb(this);
};

Rekt.prototype.literal = function (str, options) {
  this.add(escape(str));
  this.addOptions(options);
};
Rekt.prototype.any = function (str, options) {
  if (typeof str === 'string') {
    this.add('[' + str + ']');
  } else {
    options = str;
    this.add('.');
  }
  this.addOptions(options);
};
Rekt.prototype.not = function (str, options) {
  this.add('[^' + escape(str) + ']');
  this.addOptions(options);
};
Rekt.prototype.group = function (cb, options) {
  this.add('(');
  cb(this);
  this.add(')');
  this.addOptions(options);
};
Rekt.prototype.regex = function () {
  return new RegExp(this.regexStr);
};
Rekt.prototype.addOptions = function (options) {
  options = options || {};

  if (options.multiple && options.optional) {
    this.add('*');
  } else if (options.multiple) {
    this.add('+');
  } else if (options.optional) {
    this.add('?');
  }
};

/* not public, do not use externally */
Rekt.prototype.add = function (str) {
  this.regexStr += str;
};

var escape = function (str) {
  return str.split('').map(function (char) {
    if (/\w/.test(char)) {
      return char;
    } else {
      return '\\' + char;
    }
  }).join('');
};

module.exports = function (cb) {
  var r = new Rekt(cb);

  return r.regex();
};
