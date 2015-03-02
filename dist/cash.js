;(function() {
var money_finder, defaults, cash_main, cash_dom, cash_domamdjs;
money_finder = function (exports) {
  
  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  };
  var MoneyFinder = function MoneyFinder(options) {
    _classCallCheck(this, MoneyFinder);
  };
  exports = MoneyFinder;
  return exports;
}({});
defaults = function (exports) {
  
  exports = setOptions;
  function setOptions(overrides) {
    return $.extend(true, {}, {
      currencies: {
        USD: 'USD',
        '\\$': 'USD',
        bucks: 'USD',
        dollars: 'USD'
      },
      magnitudes: {
        cents: 0.01,
        hundred: 100,
        thousand: 1000,
        grand: 1000,
        lakh: 100000,
        'mil(?:lion)': 1000000,
        crore: 10000000,
        'bil(?:lion)?': 1000000000,
        'tril(?:lion)': 1000000000000
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
      }
    }, overrides);
  }
  return exports;
}({});
cash_main = function (exports, _defaults) {
  
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
  var setOptions = _interopRequire(_defaults);
  var CashStrap = function () {
    function CashStrap(options) {
      _classCallCheck(this, CashStrap);
      options = options || {};
      this.settings = options.overrides && !options.overrides.overwriteAll ? setOptions(options.overrides || {}) : options.overrides || setOptions({});
    }
    _prototypeProperties(CashStrap, {
      stringFilter: {
        value: function stringFilter(figure) {
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
          var magnitudes = Object.keys(settings.magnitudes).join('|'), currencyStr = Object.keys(settings.currencies).join('|'), numberStr = Object.keys(settings.numberWords).join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + currencyStr + ')\\s?)+[\\.\\b\\s]?)?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*(?:(?:' + currencyStr + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
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
              if (_this.constructor.stringFilter(figure)) {
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
    return CashStrap;
  }();
  exports = CashStrap;
  return exports;
}({}, defaults);
cash_dom = function (exports, _moneyFinder, _cashMain) {
  
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
  var MoneyFinder = _interopRequire(_moneyFinder);
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
          var html = $el.html();
          $el.html(this.addTags(html));
        },
        writable: true,
        configurable: true
      }
    });
    return CashDom;
  }(Cash);
  exports = CashDom;
  return exports;
}({}, money_finder, cash_main);
(function (Cash) {
  
  window.Cash = Cash;
}(cash_dom));
cash_domamdjs = undefined;
}());