;(function() {
var settings, cash_main, cash_liteamdjs;
settings = function (exports) {
  
  exports = Settings;
  function Settings(overrides) {
    var _this = this;
    $.extend(true, this, {
      'default': 'USD',
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
          ]
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
          ]
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
          ]
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
          ]
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
        'mil(?:lion)?': 1000000,
        crore: 10000000,
        'bil(?:lion)?': 1000000000,
        'tril(?:lion)?': 1000000000000
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
      }  // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
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
      magnitudeStrings: {
        get: function () {
          return Object.keys(this.magnitudes);
        }
      },
      numberStrings: {
        get: function () {
          return Object.keys(this.numberWords);
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
      this.settings = new Settings(options.overrides || {});
    }
    _prototypeProperties(Cash, {
      isValid: {
        value: function isValid(figure) {
          figure = figure.trim();
          return figure.length > 1 && /\D/.test(figure);
          // when filter support is implemented...
          return this.settings.filters.every(function (filter) {
            return filter(figure);
          });
        },
        writable: true,
        configurable: true
      },
      buildRegex: {
        value: function buildRegex(settings) {
          // TODO: use getters and setters
          var magnitudes = settings.magnitudeStrings.join('|'), prefixes = settings.prefixes.join('|'), suffixes = settings.suffixes.join('|'), numberStr = settings.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+[\\.\\b\\s]?)?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
          return regex;
        },
        writable: true,
        configurable: true
      }
    }, {
      addTags: {
        value: function addTags(html) {
          var _this = this;
          var moneyStrings = this.constructor.buildRegex(this.settings), wrapped = html.replace(moneyStrings, function (figure) {
              if (_this.constructor.isValid(figure)) {
                figure = ' ' + ('<span class="cash-node">' + figure.trim() + '</span>').trim() + ' ';
              }
              return figure;
            });
          return wrapped;
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