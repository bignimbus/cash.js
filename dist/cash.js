;(function() {
var settings, cash_main, cash_dom, cash_domamdjs;
settings = function (exports) {
  
  exports = Settings;
  function Settings(overrides) {
    var _this = this;
    // we should do this without jQuery
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
      cache: []  // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
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
          return Object.keys(this.magnitudes).concat(Object.keys(this.magnitudeAbbreviations));
        }
      },
      numberStrings: {
        get: function () {
          return Object.keys(this.numberWords);
        }
      },
      register: {
        get: function () {
          return this.cache.map(function (hash) {
            return hash;
          });
        },
        set: function (hash) {
          this.cache.push(hash);
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
      cache: {
        value: function cache(guid, hash) {
          var obj = {};
          hash.exactValue = function () {
            var val = hash.coefficient;
            hash.magnitude.forEach(function (factor) {
              val *= factor;
            });
            return val;
          }();
          obj[guid] = hash;
          return obj;
        },
        writable: true,
        configurable: true
      },
      isValid: {
        value: function isValid(figure) {
          return figure.length > 1 && /\D/.test(figure);  // when filter support is implemented...
                                                          // return this.settings.filters.every((filter) => {
                                                          //     return filter(figure);
                                                          // });
        },
        writable: true,
        configurable: true
      },
      buildRegex: {
        value: function buildRegex(settings) {
          var magnitudes = settings.magnitudeStrings.join('|'), prefixes = settings.prefixes.join('|'), suffixes = settings.suffixes.join('|'), numberStr = settings.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+' + '[\\.\\b\\s]?' + ')?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)' + '+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*' + '(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
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
              figure = figure.trim();
              if (_this.constructor.isValid(figure)) {
                var guid = _this.register(figure);
                figure = ' ' + ('<span id="' + guid + '" class="cash-node">' + figure + '</span>').trim() + ' ';
              }
              return figure;
            });
          return wrapped;
        },
        writable: true,
        configurable: true
      },
      register: {
        value: function register(figure) {
          var _this = this;
          var parseNums = function (num) {
              if (!isNaN(+num)) {
                return +num;
              }
              return _this.settings.numberWords[num] || -1;
            },
            // returns a string of 8 consecutive alphanumerics
            guid = (Math.random() + 1).toString(36).substring(7), nums = new RegExp('(?:\\d|' + this.settings.numberStrings.join('|') + '|\\.|,)+', 'gi'), multipliers = new RegExp('(?:' + this.settings.magnitudeStrings.join('|') + ')+', 'gi');
          this.settings.register = this.constructor.cache(guid, {
            str: figure,
            coefficient: parseNums(figure.match(nums)[0].replace(',', '').trim()),
            magnitude: (figure.match(multipliers) || []).map(function (mul) {
              mul = mul.trim();
              if (_this.settings.magnitudeAbbreviations[mul]) {
                mul = _this.settings.magnitudeAbbreviations[mul];
              }
              return _this.settings.magnitudes[mul] || 1;
            })
          });
          return guid;
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
cash_dom = function (exports, _cashMain) {
  
  var _interopRequire = function (obj) {
    return obj && obj.__esModule ? obj['default'] : obj;
  };
  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps)
      Object.defineProperties(child, staticProps);
    if (instanceProps)
      Object.defineProperties(child.prototype, instanceProps);
  };
  var _get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ('value' in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };
  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass)
      subClass.__proto__ = superClass;
  };
  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  };
  var Cash = _interopRequire(_cashMain);
  var CashDom = function (Cash) {
    function CashDom(options) {
      _classCallCheck(this, CashDom);
      _get(Object.getPrototypeOf(CashDom.prototype), 'constructor', this).call(this, options);
    }
    _inherits(CashDom, Cash);
    _prototypeProperties(CashDom, null, {
      grab: {
        value: function grab(nodes) {
          var _this = this;
          nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
          for (var _iterator = nodes[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
            var node = _step.value;
            $(node).each(function (i, el) {
              _this.wrap($(el));
            });
          }
        },
        writable: true,
        configurable: true
      },
      wrap: {
        value: function wrap($el) {
          var html = $el.html() || null;
          if (html) {
            $el.html(_get(Object.getPrototypeOf(CashDom.prototype), 'addTags', this).call(this, html));
          }
        },
        writable: true,
        configurable: true
      }
    });
    return CashDom;
  }(Cash);
  exports = CashDom;
  return exports;
}({}, cash_main);
(function (Cash) {
  
  window.Cash = Cash;
}(cash_dom));
cash_domamdjs = undefined;
}());