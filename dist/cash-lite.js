;(function() {
var polyfills = {}, currencies = {}, register = {}, cash_main = {}, cash_liteamdjs;
polyfills = function (exports) {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function value(target, firstSource) {
        'use strict';
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }
        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];
          if (nextSource === undefined || nextSource === null) {
            continue;
          }
          var keysArray = Object.keys(Object(nextSource));
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
        return to;
      }
    });
  }
  return exports;
}(polyfills);
currencies = function (exports) {
  exports = function () {
    return {
      formatting: {
        locale: 'en-US',
        useGroupings: true,
        round: false
      },
      // this tells the regex engine what currency to look for when tagging a string/DOM node.
      supported: ['USD'],
      // hash of all supported currencies.  Add or change these values at will.
      currencies: {
        // these are the standard abbrevations for these currencies.  If you are
        // adding currencies, it is highly recommended to use standard abbreviations.
        USD: {
          // in order for a money string to pass the regex engine and filters,
          // it must contain one of these prefixes or suffixes.
          // new RegExp() will be called on these strings, so feel free to
          // use your awesome regex skills and don't forget to escape
          // special characters.
          prefixes: [
            'USD',
            '\\$'
          ],
          suffixes: [
            'USD',
            '\\$',
            'buck[s]?',
            '(?:(?:US[A]?|American)\\s)?dollar[s]?'
          ],
          // some multipliers imply a certain currency and also change the value.
          // list those, as well.
          magnitudes: ['cent[s]?']
        },
        GBP: {
          prefixes: [
            'GBP',
            '\xA3'
          ],
          suffixes: [
            'GBP',
            '\xA3',
            'quid',
            '(?:English\\s)?pound[s]?'
          ],
          magnitudes: ['pence']
        },
        EUR: {
          prefixes: [
            'EUR',
            '\u20AC'
          ],
          suffixes: [
            'EUR',
            '\u20AC',
            'euro[s]?'
          ]
        },
        JPY: {
          prefixes: [
            'JPY',
            '\xA5'
          ],
          suffixes: [
            'JPY',
            '\xA5',
            '(?:Japan(?:ese)?\\s)?yen'
          ]
        },
        CNY: {
          prefixes: [
            'CNY',
            'yuan',
            '\xA5'
          ],
          suffixes: [
            'CNY',
            'yuan',
            '\xA5',
            '(?:Chin(?:a|ese)\\s)?(?:renminbi|yuan)'
          ]
        },
        RUB: {
          prefixes: [
            'RUB',
            '\u0440\u0443\u0431'
          ],
          suffixes: [
            'RUB',
            '\u0440\u0443\u0431',
            '(?:Russia[n]?\\s)?ruble[s]?'
          ]
        },
        CAD: {
          prefixes: [
            'CAD',
            '\\$'
          ],
          suffixes: [
            'CAD',
            '\\$',
            'buck[s]?',
            '(?:Canad(?:a|ian)\\s)?dollar[s]?'
          ],
          magnitudes: ['cent[s]?']
        },
        AUD: {
          prefixes: [
            'AUD',
            '\\$'
          ],
          suffixes: [
            'AUD',
            '\\$',
            'buck[s]?',
            '(?:Australia[n]?\\s)?dollar[s]?'
          ],
          magnitudes: ['cent[s]?']
        },
        INR: {
          prefixes: [
            'INR',
            'Rs\\.*?'
          ],
          suffixes: [
            'INR',
            'Rs\\.*?',
            '(?:India(?:n)\\s)?rupee[s]?'
          ],
          magnitudes: [
            'paise',
            'lakh',
            'crore'
          ]
        },
        MXN: {
          prefixes: [
            'MXN',
            'Mex\\$',
            '\\$'
          ],
          suffixes: [
            'MXN',
            'Mex\\$',
            '\\$',
            '(?:Mexic(?:o|an)\\s)?peso[s]?'
          ],
          magnitudes: [
            'centavo[s]?',
            'cent[s]?'
          ]
        },
        BRL: {
          prefixes: [
            'BRL',
            'R\\$'
          ],
          suffixes: [
            'BRL',
            'Real(?:es)?',
            'R\\$',
            '(?:Bra[zs]il(?:ian)?\\s)?real(?:es)?'
          ],
          magnitudes: [
            'centavo[s]?',
            'cent[s]?'
          ]
        }
      },
      // should be self explanatory.
      magnitudes: {
        pence: 0.01,
        paise: 0.01,
        cents: 0.01,
        hundred: 100,
        thousand: 1000,
        grand: 1000,
        lakh: 100000,
        million: 1000000,
        crore: 10000000,
        billion: 1000000000,
        trillion: 1000000000000
      },
      // hash of abbreviations for magnitudes
      magnitudeAbbreviations: {
        mil: 'million',
        bil: 'billion',
        tril: 'trillion'
      },
      // hash of values indexed to their English equivalents
      numberWords: {
        'a\\s': 1,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16
      },
      // array of functions added with the addFilters method.  You can pass these
      // in as a setting as well.
      filters: []
    };
  };
  return exports;
}(currencies);
register = function (exports, _polyfills, _currencies) {
  var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
  };
  exports = Register;
  var currencies = _interopRequire(_currencies);
  function format(obj, opts) {
    var cents = opts.round ? 0 : 2;
    return obj.exactValue.toLocaleString(opts.locale, {
      minimumFractionDigits: cents,
      maximumFractionDigits: cents,
      useGrouping: opts.useGrouping
    });
  }
  function Register(overrides, isDom) {
    Object.assign(this, currencies(), overrides);
    Object.defineProperties(this, {
      supportedCurrencies: {
        get: function get() {
          var _this = this;
          var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
            return _this.currencies[currency].prefixes.length && _this.currencies[currency].suffixes.length && _this.currencies[currency].value !== void 0;
          });
          if (validCurrencies.length) {
            return validCurrencies;
          }
          throw new Error('no valid currencies detected!');
        }
      },
      prefixes: {
        get: function get() {
          var _this = this;
          var prefixes = [];
          this.supported.forEach(function (currency) {
            prefixes = prefixes.concat(_this.currencies[currency].prefixes || []);
          }.bind(this));
          return prefixes;
        }
      },
      suffixes: {
        get: function get() {
          var _this = this;
          var suffixes = [];
          this.supported.forEach(function (currency) {
            suffixes = suffixes.concat(_this.currencies[currency].suffixes || []);
          }.bind(this));
          return suffixes;
        }
      },
      specialMagnitudes: {
        get: function get() {
          var _this = this;
          var magnitudes = [];
          this.supported.forEach(function (currency) {
            magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
          }.bind(this));
          return magnitudes;
        }
      },
      magnitudeStrings: {
        get: function get() {
          return Object.keys(this.magnitudes).concat(Object.keys(this.magnitudeAbbreviations));
        }
      },
      numberStrings: {
        get: function get() {
          return Object.keys(this.numberWords);
        }
      },
      cache: {
        get: function get() {
          return this.metadata;
        },
        set: function set(arr) {
          var _this = this;
          var guid = arr[0], hash = arr[1];
          hash.id = guid;
          this.metadata[guid] = hash;
          if (isDom) {
            Object.observe(this.metadata[guid], function (obj) {
              obj = obj[0].object;
              var display = format(obj, _this.formatting);
              $('#' + obj.id).html('' + obj.currency + ' ' + display);
            });
          }
        }
      }
    });
    return this;
  }
  return exports;
}(register, polyfills, currencies);
cash_main = function (exports, _register) {
  var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
  };
  var _createClass = function () {
    function defineProperties(target, props) {
      for (var key in props) {
        var prop = props[key];
        prop.configurable = true;
        if (prop.value)
          prop.writable = true;
      }
      Object.defineProperties(target, props);
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  };
  var Register = _interopRequire(_register);
  var Cash = function () {
    function Cash(options, isDom) {
      _classCallCheck(this, Cash);
      options = options || {};
      this.register = new Register(options || {}, isDom || false);
    }
    _createClass(Cash, {
      lookFor: {
        value: function lookFor() {
          for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
            currencies[_key] = arguments[_key];
          }
          this.register.supported = currencies;
          return this;
        }
      },
      tag: {
        value: function tag(html) {
          var _this = this;
          var moneyStrings = this.constructor.buildRegex(this.register), wrapped = html.replace(moneyStrings, function (figure) {
              var trimmed = figure.trim();
              if (_this.constructor.isValid.call(_this, trimmed)) {
                var guid = _this.constructor.generateGuid(), hash = _this.constructor.formHash.call(_this, trimmed);
                _this.register.cache = [
                  guid,
                  hash
                ];
                figure = ' <span id="' + guid + '" class="cash-node">' + trimmed + '</span> ';
              }
              return figure;
            });
          return wrapped;
        }
      },
      addFilters: {
        value: function addFilters() {
          var filters = Array.prototype.slice.call(arguments);
          filters = filters.filter(function (filter) {
            return typeof filter === 'function';
          });
          this.register.filters = this.register.filters.concat(filters);
          return this;
        }
      },
      setValues: {
        value: function setValues(hash) {
          if (!(hash instanceof Object)) {
            throw new Error('exchange rates must be passed as an object, e.g.{"USD": 1, "EUR": 0.92}');
          }
          for (var currency in hash) {
            var value = +hash[currency];
            if (!isNaN(value)) {
              this.register.currencies[currency].value = value;
            }
          }
          return this;
        }
      },
      setLocale: {
        value: function setLocale(locale) {
          this.register.formatting.locale = locale;
          return this;
        }
      }
    }, {
      generateGuid: {
        value: function generateGuid() {
          // returns a string of 8 consecutive alphanumerics
          return (Math.random() + 1).toString(36).substring(7);
        }
      },
      formHash: {
        value: function formHash(figure) {
          var _this = this;
          var currency = this.constructor.inferCurrency.call(this, figure), parseNums = function (num) {
              if (!isNaN(+num)) {
                return +num;
              }
              return _this.register.numberWords[num] || 1;
            }, nums = new RegExp('(?:\\d|' + this.register.numberStrings.join('|') + '|\\.|,)+', 'gi'), multipliers = new RegExp('(?:' + this.register.magnitudeStrings.join('|') + ')+', 'gi'), hash = {
              currency: currency,
              rate: this.register.currencies[currency].value || 1,
              str: figure,
              coefficient: parseNums(figure.match(nums)[0].replace(',', '').trim()),
              magnitude: (figure.match(multipliers) || []).map(function (mul) {
                mul = mul.trim();
                if (_this.register.magnitudeAbbreviations[mul]) {
                  mul = _this.register.magnitudeAbbreviations[mul];
                }
                return _this.register.magnitudes[mul] || 1;
              })
            };
          hash.exactValue = function () {
            var val = hash.coefficient;
            hash.magnitude.forEach(function (factor) {
              val *= factor;
            });
            return val;
          }();
          return hash;
        }
      },
      inferCurrency: {
        value: function inferCurrency(figure) {
          var _this = this;
          var match = undefined, regex = undefined, found = undefined, currencies = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes);
          currencies = '(?:' + currencies.join('|') + ')';
          regex = new RegExp(currencies, 'i');
          match = figure.match(regex)[0];
          this.register.supported.forEach(function (currency) {
            var current = _this.register.currencies[currency], symbols = [].concat(current.prefixes, current.suffixes, current.magnitudes || []);
            symbols = new RegExp('(?:' + symbols.join('|') + ')', 'i');
            if (symbols.test(match)) {
              found = currency;
            }
          });
          return found;
        }
      },
      isValid: {
        value: function isValid(figure) {
          var currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes), hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'), isValidStr = hasCurrencySpec.test(figure) && this.register.filters.every(function (filter) {
              return filter(figure);
            });
          return isValidStr;
        }
      },
      buildRegex: {
        value: function buildRegex(keywords) {
          var magnitudes = keywords.magnitudeStrings.join('|'), prefixes = keywords.prefixes.join('|'), suffixes = [].concat(keywords.suffixes, keywords.specialMagnitudes).join('|'), numberStr = keywords.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+' + '[\\.\\b\\s]?' + ')?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)' + '+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*' + '(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
          return regex;
        }
      }
    });
    return Cash;
  }();
  exports = Cash;
  return exports;
}(cash_main, register);
(function (Cash) {
  window.Cash = Cash;
}(cash_main));
cash_liteamdjs = undefined;
}());