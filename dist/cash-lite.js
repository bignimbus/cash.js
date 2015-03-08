;(function() {
var settings, cash_main, cash_liteamdjs;
settings = function (exports) {
  
  exports = Settings;
  function Settings(overrides) {
    var _this = this;
    // we should do this without jQuery
    $.extend(true, this, {
      'default': 'USD',
      current: 'USD',
      supportedCurrencies: [],
      currencies: {
        USD: {
          prefixes: [
            'USD',
            '\\$'
          ],
          suffixes: [
            'USD',
            '\\$',
            'bucks',
            '(?:(?:US[A]?|American)\\s)?dollar[s]?'
          ],
          magnitudes: ['cents']
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
            'pound[s]?'
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
            '(?:Chin(?:a|ese)\\s)?renminbi'
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
          magnitudes: ['cents']
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
          magnitudes: ['cents']
        },
        INR: {
          prefixes: [
            'INR',
            'Rs\\.?'
          ],
          suffixes: [
            'INR',
            'Rs\\.?',
            '(?:India(?:n)\\s)?rupee[s]?'
          ],
          magnitudes: [
            'paise',
            'lakh',
            'crore'
          ]
        }
      },
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
      magnitudeAbbreviations: {
        mil: 'million',
        bil: 'billion',
        tril: 'trillion'
      },
      numberWords: {
        a: 1,
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
      metadata: {},
      filters: []  // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
    }, overrides);
    Object.defineProperties(this, {
      supportedCurrencies: {
        get: function () {
          return this.supportedCurrencies.concat(this['default']);
        },
        set: function (currencies) {
          if (currencies instanceof Array) {
            _this.supportedCurrencies = currencies.filter(function (currency) {
              return currency !== this['default'];
            }, _this);
          } else {
            throw new Error('currencies must be expressed as an array of strings');
          }
        }
      },
      prefixes: {
        get: function () {
          return this.currencies[this['default']].prefixes;
        },
        set: function (prefixes) {
          if (prefixes instanceof Array) {
            this.currencies[this['default']].prefixes = prefixes;
          } else {
            throw new Error('prefixes must be expressed as an array of strings');
          }
        }
      },
      suffixes: {
        get: function () {
          return this.currencies[this['default']].suffixes;
        },
        set: function (suffixes) {
          if (suffixes instanceof Array) {
            this.currencies[this['default']].suffixes = suffixes;
          } else {
            throw new Error('prefixes must be expressed as an array of strings');
          }
        }
      },
      specialMagnitudes: {
        get: function () {
          return this.currencies[this['default']].magnitudes;
        }
      },
      magnitudeStrings: {
        get: function () {
          return Object.keys(this.magnitudes).concat(Object.keys(this.magnitudeAbbreviations));
        }
      },
      numberStrings: {
        get: function () {
          return Object.keys(this.numberWords);
        }
      },
      cache: {
        get: function () {
          return this.metadata;
        },
        set: function (arr) {
          // [guid, hash]
          this.metadata[arr[0]] = arr[1];
        }
      }
    });
    return this;
  }
  return exports;
}({});
cash_main = function (exports, _settings) {
  
  var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
  };
  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);
    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };
  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  };
  var Settings = _interopRequire(_settings);
  var Cash = function () {
    function Cash(options) {
      _classCallCheck(this, Cash);
      options = options || {};
      this.register = new Settings(options.overrides || {});
    }
    _prototypeProperties(Cash, {
      generateGuid: {
        value: function generateGuid() {
          // returns a string of 8 consecutive alphanumerics
          return (Math.random() + 1).toString(36).substring(7);
        },
        writable: true,
        configurable: true
      },
      formHash: {
        value: function formHash(figure, keywords) {
          var parseNums = function (num) {
              if (!isNaN(+num)) {
                return +num;
              }
              return keywords.numberWords[num] || -1;
            }, nums = new RegExp('(?:\\d|' + keywords.numberStrings.join('|') + '|\\.|,)+', 'gi'), multipliers = new RegExp('(?:' + keywords.magnitudeStrings.join('|') + ')+', 'gi');
          return {
            currency: keywords.current,
            str: figure,
            coefficient: parseNums(figure.match(nums)[0].replace(',', '').trim()),
            magnitude: (figure.match(multipliers) || []).map(function (mul) {
              mul = mul.trim();
              if (keywords.magnitudeAbbreviations[mul]) {
                mul = keywords.magnitudeAbbreviations[mul];
              }
              return keywords.magnitudes[mul] || 1;
            })
          };
        },
        writable: true,
        configurable: true
      },
      computeExactValue: {
        value: function computeExactValue(hash) {
          hash.exactValue = function () {
            var val = hash.coefficient;
            hash.magnitude.forEach(function (factor) {
              val *= factor;
            });
            return val;
          }();
          return hash;
        },
        writable: true,
        configurable: true
      },
      isValid: {
        value: function isValid(figure, register) {
          var currencyStr = [].concat(register.prefixes, register.suffixes, register.specialMagnitudes), hasCurrencySpec = new RegExp('(?:' + currencyStr.join(')|(?:') + ')', 'i'), isValidStr = hasCurrencySpec.test(figure) && register.filters.every(function (filter) {
              return filter(figure);
            });
          return isValidStr;
        },
        writable: true,
        configurable: true
      },
      buildRegex: {
        value: function buildRegex(keywords) {
          var magnitudes = keywords.magnitudeStrings.join('|'), prefixes = keywords.prefixes.join('|'), suffixes = keywords.suffixes.join('|'), numberStr = keywords.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+' + '[\\.\\b\\s]?' + ')?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)' + '+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*' + '(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
          return regex;
        },
        writable: true,
        configurable: true
      }
    }, {
      tag: {
        value: function tag(html) {
          var _this = this;
          var moneyStrings = this.constructor.buildRegex(this.register), wrapped = html.replace(moneyStrings, function (figure) {
              figure = figure.trim();
              if (_this.constructor.isValid(figure, _this.register)) {
                var guid = _this.constructor.generateGuid(), hash = _this.constructor.formHash(figure, _this.register);
                _this.register.cache = [
                  guid,
                  _this.constructor.computeExactValue(hash)
                ];
                figure = ' <span id="' + guid + '" class="cash-node">' + figure + '</span> ';
              }
              return figure;
            });
          return wrapped;
        },
        writable: true,
        configurable: true
      },
      addFilters: {
        value: function addFilters() {
          var filters = Array.prototype.slice.call(arguments);
          filters = filters.filter(function (filter) {
            return typeof filter === 'function';
          });
          this.register.filters = this.register.filters.concat(filters);
        },
        writable: true,
        configurable: true
      },
      exchange: {
        value: function exchange(hash) {
          // always make the default currency worth 1
          if (!(hash instanceof Object)) {
            throw new Error('exchange rates must be passed as an object, e.g.{"USD": 1, "EUR": 0.92}');
            return;
          }
          for (var currency in hash) {
            var value = +hash[currency];
            if (!isNaN(value)) {
              this.register.currencies[currency].value = value;
            }
          }
        },
        writable: true,
        configurable: true
      }
    });
    return Cash;
  }();
  exports = Cash;
  return exports;
}({}, settings);
(function (Cash) {
  
  window.Cash = Cash;
}(cash_main));
cash_liteamdjs = undefined;
}());