module.exports = function (cb) {
  var r = new Rekt(cb);

  return r.regex();
};


var Rekt = function (cb) {
  this.regexStr = '';
  cb(this);
};

/* Public */
Rekt.prototype.literal = function (str, options) {
  var hasOptions = typeof options === 'object' &&
                   Object.keys(options).length > 0 &&
                   str.length > 1;
  if (hasOptions) {
    this.add('(?:');
  }

  this.add(escape(str));

  if (hasOptions) {
    this.add(')');
  }
  this.addOptions(options);
};

Rekt.prototype.any = function (str, options) {
  if (typeof str === 'string') {
    this.add('[' + escape(str) + ']');
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
  if (options && options.ignore) {
    this.add('?:');
  }
  cb(this);
  this.add(')');
  this.addOptions(options);
};

/* Private */

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
  } else if (typeof options.repeat === 'number') {
    this.add('{' + options.repeat + '}');
  } else if (
             typeof options.from === 'number' ||
             typeof options.to   === 'number'
            ) {
    this.add('{');
    if (typeof options.from === 'number') {
      this.add(options.from);
    }
    this.add(',');
    if (typeof options.to === 'number') {
      this.add(options.to);
    }
    this.add('}');
  }
};

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
