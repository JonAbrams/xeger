var Rekt = function (cb) {
  this.index = 0;
  this.regexStr = '';

  cb(this);
};

Rekt.prototype.literal = function (str, options) {
  this.insert(escape(str));
  this.insertOptions(options);
};
Rekt.prototype.any = function (str, options) {};
Rekt.prototype.set = function (str, options) {};
Rekt.prototype.notSet = function (str, options) {};
Rekt.prototype.group = function (cb, options) {};
Rekt.prototype.regex = function () {
  return new RegExp(this.regexStr);
};
Rekt.prototype.insertOptions = function (options) {
  options = options || {};

  if (options.multiple && options.optional) {
    this.insert('*');
  } else if (options.multiple) {
    this.insert('+');
  } else if (options.optional) {
    this.insert('?');
  }
};

/* not public, do not use externally */
Rekt.prototype.insert = function (str) {
  var left = this.regexStr.slice(0, this.index);
  var right = this.regexStr.slice(this.index);
  this.regexStr = left + str + right;
  this.index += str.length;
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
