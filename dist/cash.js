;(function() {
var polyfills = {}, currencies = {}, register = {}, cashex = {}, cash_main = {}, cash_dom = {}, cash_domamdjs;
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
          prefixes: {
            symbolic: ['\\$'],
            formal: ['USD']
          },
          suffixes: {
            symbolic: ['\\$'],
            conversational: ['(?:(?:US[A]?|American)\\s)?dollar[s]?'],
            casual: [
              'buck[s]?',
              'bucks'
            ],
            formal: ['USD']
          },
          // some multipliers imply a certain currency and also change the value.
          // list those, as well.
          magnitudes: ['cent[s]?'],
          translations: {
            casual: 'bucks',
            conversational: 'dollars',
            symbolic: '$'
          }
        },
        GBP: {
          prefixes: {
            symbolic: ['\xA3'],
            formal: ['GBP']
          },
          suffixes: {
            symbolic: ['\xA3'],
            casual: ['quid'],
            conversational: ['(?:English\\s)?pound[s]?'],
            formal: ['GBP']
          },
          magnitudes: ['pence'],
          translations: {
            casual: 'quid',
            conversational: 'pounds',
            symbolic: '\xA3'
          }
        },
        EUR: {
          prefixes: {
            symbolic: ['\u20AC'],
            formal: ['EUR']
          },
          suffixes: {
            symbolic: ['\u20AC'],
            conversational: ['euro[s]?'],
            formal: ['EUR']
          },
          translations: {
            formal: 'EUR',
            conversational: 'euro',
            symbolic: '\u20AC'
          }
        },
        JPY: {
          prefixes: {
            symbolic: ['\xA5'],
            formal: ['JPY']
          },
          suffixes: {
            symbolic: ['\xA5'],
            conversational: ['(?:Japan(?:ese)?\\s)?yen'],
            formal: ['JPY']
          },
          translations: {
            conversational: 'yen',
            symbolic: '\xA5'
          }
        },
        CNY: {
          prefixes: {
            symbolic: ['\xA5'],
            formal: ['CNY']
          },
          suffixes: {
            conversational: [
              'yuan',
              '(?:Chin(?:a|ese)\\s)?(?:renminbi|yuan)'
            ],
            symbolic: ['\xA5'],
            formal: ['CNY']
          },
          translations: {
            conversational: 'yuan',
            symbolic: '\xA5'
          }
        },
        RUB: {
          prefixes: {
            symbolic: ['\u0440\u0443\u0431'],
            formal: ['RUB']
          },
          suffixes: {
            symbolic: ['\u0440\u0443\u0431'],
            conversational: ['(?:Russia[n]?\\s)?ruble[s]?'],
            formal: ['RUB']
          },
          translations: {
            conversational: 'rubles',
            symbolic: '\u0440\u0443\u0431'
          }
        },
        CAD: {
          prefixes: {
            symbolic: ['\\$'],
            formal: ['CAD']
          },
          suffixes: {
            symbolic: ['\\$'],
            casual: ['buck[s]?'],
            conversational: ['(?:Canad(?:a|ian)\\s)?dollar[s]?'],
            formal: ['CAD']
          },
          magnitudes: [
            'cent[s]?',
            'cents'
          ],
          translations: {
            symbolic: '$',
            casual: 'bucks',
            conversational: 'dollars'
          }
        },
        AUD: {
          prefixes: {
            symbolic: ['\\$'],
            formal: ['AUD']
          },
          suffixes: {
            symbolic: ['\\$'],
            casual: [
              'buck[s]?',
              'bucks'
            ],
            conversational: ['(?:Australia[n]?\\s)?dollar[s]?'],
            formal: ['AUD']
          },
          magnitudes: ['cent[s]?'],
          translations: {
            casual: 'bucks',
            symbolic: '$',
            conversational: 'dollars'
          }
        },
        INR: {
          prefixes: {
            symbolic: [
              'Rs\\.*?',
              'Rs\\.'
            ],
            formal: ['INR']
          },
          suffixes: {
            symbolic: ['Rs\\.*?'],
            conversational: ['(?:India(?:n)\\s)?rupee[s]?'],
            formal: ['INR']
          },
          magnitudes: [
            'paise',
            'lakh',
            'crore'
          ],
          translations: {
            conversational: 'rupees',
            symbolic: 'Rs'
          }
        },
        MXN: {
          prefixes: {
            symbolic: [
              '\\$',
              'Mex\\$'
            ],
            formal: ['MXN']
          },
          suffixes: {
            symbolic: [
              '\\$',
              'Mex\\$'
            ],
            conversational: ['(?:Mexic(?:o|an)\\s)?peso[s]?'],
            formal: ['MXN']
          },
          magnitudes: [
            'centavo[s]?',
            'cent[s]?'
          ],
          translations: {
            conversational: 'pesos',
            symbolic: 'Mex$'
          }
        },
        BRL: {
          prefixes: {
            symbolic: ['R\\$'],
            formal: ['BRL']
          },
          suffixes: {
            conversational: ['(?:Bra[zs]il(?:ian)?\\s)?real(?:es)?'],
            symbolic: ['R\\$'],
            formal: ['BRL']
          },
          magnitudes: [
            'centavo[s]?',
            'cent[s]?'
          ],
          translations: {
            symbolic: 'R$',
            conversational: 'reales'
          }
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
  var currencies = _interopRequire(_currencies);
  var Register = function () {
    function Register(overrides, isDom) {
      _classCallCheck(this, Register);
      Object.assign(this, currencies(), overrides, { isDom: isDom });
      Object.defineProperties(this, {
        supportedCurrencies: {
          get: function get() {
            var _this = this;
            var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
              return Object.keys(_this.currencies[currency].prefixes).length && Object.keys(_this.currencies[currency].suffixes).length && _this.currencies[currency].value !== void 0;
            });
            if (validCurrencies.length) {
              return validCurrencies;
            }
            throw new Error('no valid currencies detected!');
          }
        },
        specialMagnitudes: {
          get: function get() {
            var _this = this;
            var magnitudes = [];
            this.supported.forEach(function (currency) {
              magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
            }, this);
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
          set: function set(cashexp) {
            var guid = cashexp.guid, hash = cashexp;
            hash.guid = guid;
            this.metadata[guid] = hash;
          }
        }
      });
    }
    _createClass(Register, {
      getPrefixes: {
        value: function getPrefixes() {
          var _this = this;
          for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
            currencies[_key] = arguments[_key];
          }
          if (!currencies.length) {
            currencies = this.supported;
          }
          var prefixes = [];
          currencies.forEach(function (currency) {
            if (!_this.currencies[currency]) {
              return;
            }
            for (var i in _this.currencies[currency].prefixes) {
              var thing = _this.currencies[currency].prefixes[i];
              prefixes = [].concat(prefixes, thing || []);
            }
          });
          return prefixes;
        }
      },
      getSuffixes: {
        value: function getSuffixes() {
          var _this = this;
          for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
            currencies[_key] = arguments[_key];
          }
          if (!currencies.length) {
            currencies = this.supported;
          }
          var suffixes = [];
          currencies.forEach(function (currency) {
            if (!_this.currencies[currency]) {
              return;
            }
            for (var i in _this.currencies[currency].suffixes) {
              suffixes = suffixes.concat(_this.currencies[currency].suffixes[i] || []);
            }
          });
          return suffixes;
        }
      }
    });
    return Register;
  }();
  exports = Register;
  return exports;
}(register, polyfills, currencies);
cashex = function (exports) {
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
  var CashEx = function () {
    function CashEx(str, register) {
      _classCallCheck(this, CashEx);
      this.raw = str;
      this.data = {};
      this.register = register;
      this.guid = (Math.random() + 1).toString(36).substring(7);
      this.analyze();
    }
    _createClass(CashEx, {
      analyze: {
        value: function analyze() {
          var _this = this;
          var currency = this.inferCurrency(this.raw), parseNums = function (num) {
              if (!isNaN(+num)) {
                return +num;
              }
              return _this.register.numberWords[num] || 1;
            }, nums = this.raw.match(new RegExp('(?:\\d|' + this.register.numberStrings.join('|') + '|\\.|,)+', 'gi'))[0], multipliers = new RegExp('(?:' + this.register.magnitudeStrings.join('|') + ')+', 'gi');
          Object.assign(this, {
            currency: currency.code,
            rate: this.register.currencies[currency.code].value || 1,
            str: this.raw,
            prefixed: currency.index < this.raw.indexOf(nums),
            coefficient: parseNums(nums.replace(',', '').trim()),
            magnitude: (this.raw.match(multipliers) || []).map(function (mul) {
              mul = mul.trim();
              if (_this.register.magnitudeAbbreviations[mul]) {
                mul = _this.register.magnitudeAbbreviations[mul];
              }
              return _this.register.magnitudes[mul] || 1;
            })
          });
          this.exactValue = function () {
            var val = _this.coefficient;
            _this.magnitude.forEach(function (factor) {
              val *= factor;
            });
            return val;
          }();
          this.voice = this.inferVoice();
        }
      },
      inferVoice: {
        value: function inferVoice() {
          var obj = this.register.currencies[this.currency], choices = this.prefixed ? obj.prefixes : obj.suffixes;
          for (var i in choices) {
            var str = '(?:' + choices[i].join('|') + ')', regex = new RegExp(str, 'i');
            if (regex.test(this.raw)) {
              return i;
            }
          }
          if (!this.prefixed) {
            var str = obj.magnitudes.join('|'), regex = new RegExp(str, 'i');
            if (regex.test(this.raw)) {
              return 'conversational';
            }
          }
          return 'formal';
        }
      },
      inferCurrency: {
        value: function inferCurrency() {
          var _this = this;
          var index = undefined, match = undefined, regex = undefined, found = undefined, candidate = undefined, currentCandidate = undefined, currencies = [].concat(this.register.getPrefixes(), this.register.getSuffixes(), this.register.specialMagnitudes);
          currencies = '(?:' + currencies.join('|') + ')';
          regex = new RegExp(currencies, 'i');
          match = this.raw.match(regex)[0];
          this.register.supported.forEach(function (currency) {
            var candidate = undefined, current = _this.register.currencies[currency], symbols = [].concat(_this.register.getPrefixes(currency), _this.register.getSuffixes(currency), current.magnitudes || []);
            symbols = new RegExp('(?:' + symbols.join('|') + ')', 'i');
            candidate = match.match(symbols);
            candidate = candidate ? candidate[0] : candidate;
            if (candidate) {
              if (currentCandidate) {
                found = candidate.length > currentCandidate.length ? currency : found;
              } else {
                found = currency;
              }
              currentCandidate = candidate;
              candidate = null;
              index = _this.raw.indexOf(match);
            }
          });
          return {
            code: found,
            index: index
          };
        }
      },
      recalculate: {
        value: function recalculate(currency) {
          var oldRate = currency ? this.register.currencies[this.currency].value : 1, current = currency || this.currency, rate = this.register.currencies[current].value, multiplier = 1 / oldRate;
          Object.assign(this, {
            currency: current,
            rate: rate,
            exactValue: this.exactValue * multiplier * rate
          });
          if (this.register.isDom) {
            this.updateDom();
          }
        }
      },
      updateDom: {
        value: function updateDom(obj) {
          var obj = this.register.currencies[this.currency].translations, str = obj[this.voice] || this.currency, order = [
              this.format(),
              str
            ];
          if (this.prefixed) {
            order.reverse();
          }
          str = order.join(this.voice === 'symbolic' ? '' : ' ').replace(/\\/g, '');
          $('#' + this.guid).html(str);
        }
      },
      format: {
        value: function format() {
          'use strict';
          var cents = this.register.formatting.round ? 0 : 2;
          return this.exactValue.toLocaleString(this.register.formatting.locale, {
            minimumFractionDigits: cents,
            maximumFractionDigits: cents,
            useGrouping: this.register.formatting.useGrouping
          });
        }
      }
    });
    return CashEx;
  }();
  exports = CashEx;
  return exports;
}(cashex);
cash_main = function (exports, _register, _cashex) {
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
  var CashEx = _interopRequire(_cashex);
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
          var moneyStrings = this.buildRegex(), wrapped = html.replace(moneyStrings, function (figure) {
              var trimmed = figure.trim();
              if (_this.isValid(trimmed)) {
                var cashex = new CashEx(trimmed, _this.register);
                _this.register.cache = cashex;
                figure = ' <span id="' + cashex.guid + '" class="cash-node">' + trimmed + '</span> ';
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
      },
      buildRegex: {
        value: function buildRegex() {
          var magnitudes = this.register.magnitudeStrings.join('|'), prefixes = this.register.getPrefixes().join('|'), suffixes = [].concat(this.register.getSuffixes(), this.register.specialMagnitudes).join('|'), numberStr = this.register.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+' + '[\\.\\b\\s]?' + ')?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)' + '+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*' + '(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
          return regex;
        }
      },
      isValid: {
        value: function isValid(figure) {
          var currencyStr = [].concat(this.register.getPrefixes(), this.register.getSuffixes(), this.register.specialMagnitudes), hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'), isValidStr = hasCurrencySpec.test(figure) && this.register.filters.every(function (filter) {
              return filter(figure);
            });
          return isValidStr;
        }
      }
    });
    return Cash;
  }();
  exports = Cash;
  return exports;
}(cash_main, register, cashex);
cash_dom = function (exports, _cashMain) {
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
  var CashDom = function (_Cash) {
    function CashDom(options) {
      _classCallCheck(this, CashDom);
      options = options || {};
      _get(Object.getPrototypeOf(CashDom.prototype), 'constructor', this).call(this, options, true);
      this.register.metadata = {};
      if (options.metadata) {
        for (var id in options.metadata) {
          this.register.cache = options.metadata[id];
        }
      }
    }
    _inherits(CashDom, _Cash);
    _createClass(CashDom, {
      wrap: {
        value: function wrap(nodes) {
          var _this = this;
          nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
          for (var node in nodes) {
            node = nodes[node];
            $(node).each(function (i, el) {
              var $el = $(el), html = $el.html() || '';
              html = html.replace(/<span id="\w*?"\sclass="cash-node">([^<]*?)<\/span>/gi, function (m, text) {
                return text;
              });
              if (html) {
                $el.html(_get(Object.getPrototypeOf(CashDom.prototype), 'tag', _this).call(_this, html));
              }
            });
          }
          return this;
        }
      },
      exchange: {
        value: function exchange() {
          var _this2 = this;
          for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
            currencies[_key] = arguments[_key];
          }
          if (currencies[0] instanceof Array) {
            currencies = currencies[0];
          }
          currencies.forEach(function (currency) {
            if (_this2.register.supportedCurrencies.indexOf(currency) === -1) {
              throw new Error('' + currency + ' not supported.');
            }
          });
          this['for'] = function (targets, source) {
            _this2.constructor.recalculate.call(_this2, source, targets);
          }.bind(this, currencies);
          return this;
        }
      },
      update: {
        value: function update() {
          this.constructor.recalculate.call(this);
          return this;
        }
      }
    }, {
      recalculate: {
        value: function recalculate(source, targets) {
          var obj = undefined, rate = undefined, current = undefined, oldRate = undefined, multiplier = undefined, cache = this.register.metadata;
          for (var id in cache) {
            if (targets && targets.indexOf(cache[id].currency) === -1) {
              continue;
            }
            cache[id].recalculate(source);
          }
          if (this['for']) {
            this['for'] = null;
          }
        }
      }
    });
    return CashDom;
  }(Cash);
  exports = CashDom;
  return exports;
}(cash_dom, cash_main);
(function (Cash) {
  window.Cash = Cash;
}(cash_dom));
cash_domamdjs = undefined;
}());