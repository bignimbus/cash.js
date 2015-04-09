;(function() {
var polyfills, settings, cash_main, cash_dom, bower_components_objectobserve_dist_object_observemin, cash_domamdjs;
polyfills = function (exports) {
  
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function value(target, firstSource) {
        
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
}({});
settings = function (exports, _polyfills) {
  
  exports = Settings;
  function Settings(overrides, isDom) {
    Object.assign(this, {
      // this tells the regex engine what currency to look for when tagging a string/DOM node.
      supported: ['USD'],
      // hash of all supported currencies.  Add or change these values at will.
      currencies: {
        // these areg the standard abbrevations for these currencies.  If you are
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
    }, overrides);
    Object.defineProperties(this, {
      supportedCurrencies: {
        get: function () {
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
        get: function () {
          var _this = this;
          var prefixes = [];
          this.supported.forEach(function (currency) {
            prefixes = prefixes.concat(_this.currencies[currency].prefixes || []);
          }.bind(this));
          return prefixes;
        }
      },
      suffixes: {
        get: function () {
          var _this = this;
          var suffixes = [];
          this.supported.forEach(function (currency) {
            suffixes = suffixes.concat(_this.currencies[currency].suffixes || []);
          }.bind(this));
          return suffixes;
        }
      },
      specialMagnitudes: {
        get: function () {
          var _this = this;
          var magnitudes = [];
          this.supported.forEach(function (currency) {
            magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
          }.bind(this));
          return magnitudes;
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
          var guid = arr[0], hash = arr[1];
          hash.id = guid;
          this.metadata[guid] = hash;
          if (isDom) {
            Object.observe(this.metadata[guid], function (obj) {
              obj = obj[0].object;
              $('#' + obj.id).html('' + obj.currency + ' ' + obj.exactValue);
            });
          }
        }
      }
    });
    return this;
  }
  return exports;
}({}, polyfills);
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
    function Cash(options, isDom) {
      _classCallCheck(this, Cash);
      options = options || {};
      this.register = new Settings(options.overrides || {}, isDom || false);
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
            var val = hash.coefficient * hash.rate;
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
        },
        writable: true,
        configurable: true
      },
      isValid: {
        value: function isValid(figure) {
          var currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes), hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'), isValidStr = hasCurrencySpec.test(figure) && this.register.filters.every(function (filter) {
              return filter(figure);
            });
          return isValidStr;
        },
        writable: true,
        configurable: true
      },
      buildRegex: {
        value: function buildRegex(keywords) {
          var magnitudes = keywords.magnitudeStrings.join('|'), prefixes = keywords.prefixes.join('|'), suffixes = [].concat(keywords.suffixes, keywords.specialMagnitudes).join('|'), numberStr = keywords.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+' + '[\\.\\b\\s]?' + ')?' + '((\\d|' + numberStr + ')+(?:\\.|,)?)' + '+\\s?' + '(?:(?:' + magnitudes + ')\\s?)*' + '(?:(?:' + suffixes + ')\\s?)*', regex = new RegExp(regexStr, 'ig');
          return regex;
        },
        writable: true,
        configurable: true
      }
    }, {
      lookFor: {
        value: function lookFor() {
          for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
            currencies[_key] = arguments[_key];
          }
          this.register.supported = currencies;
          return this;
        },
        writable: true,
        configurable: true
      },
      tag: {
        value: function tag(html) {
          var _this = this;
          var moneyStrings = this.constructor.buildRegex(this.register), wrapped = html.replace(moneyStrings, function (figure) {
              figure = figure.trim();
              if (_this.constructor.isValid.call(_this, figure)) {
                var guid = _this.constructor.generateGuid(), hash = _this.constructor.formHash.call(_this, figure);
                _this.register.cache = [
                  guid,
                  hash
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
          return this;
        },
        writable: true,
        configurable: true
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
      options = options || {};
      _get(Object.getPrototypeOf(CashDom.prototype), 'constructor', this).call(this, options, true);
      this.register.metadata = {};
      if (options.metadata) {
        for (var id in options.metadata) {
          this.register.cache = options.metadata[id];
        }
      }
    }
    _inherits(CashDom, Cash);
    _prototypeProperties(CashDom, {
      exchange: {
        value: function exchange(currency) {
          var obj = undefined, rate = undefined, current = undefined, oldRate = undefined, multiplier = undefined, cache = this.register.metadata;
          for (id in cache) {
            obj = {};
            oldRate = currency ? this.register.currencies[cache[id].currency].value : 1;
            current = currency || cache[id].currency;
            rate = this.register.currencies[current].value;
            multiplier = 1 / oldRate;
            Object.assign(cache[id], {
              currency: current,
              rate: rate,
              exactValue: cache[id].exactValue * multiplier * rate
            });
          }
        },
        writable: true,
        configurable: true
      }
    }, {
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
        },
        writable: true,
        configurable: true
      },
      setCurrency: {
        value: function setCurrency(currency) {
          if (this.register.supportedCurrencies.indexOf(currency) === -1) {
            throw new Error('currency not supported.');
          }
          this.register.current = currency;
          this.constructor.exchange.call(this, currency);
          return this;
        },
        writable: true,
        configurable: true
      },
      update: {
        value: function update() {
          this.constructor.exchange.call(this);
          return this;
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
Object.observe || function (O, A, root) {
  
  var observed, handlers, defaultAcceptList = [
      'add',
      'update',
      'delete',
      'reconfigure',
      'setPrototype',
      'preventExtensions'
    ];
  var isArray = A.isArray || function (toString) {
      return function (object) {
        return toString.call(object) === '[object Array]';
      };
    }(O.prototype.toString), inArray = A.prototype.indexOf ? A.indexOf || function (array, pivot, start) {
      return A.prototype.indexOf.call(array, pivot, start);
    } : function (array, pivot, start) {
      for (var i = start || 0; i < array.length; i++)
        if (array[i] === pivot)
          return i;
      return -1;
    }, createMap = typeof root.Map === 'undefined' || !Map.prototype.forEach ? function () {
      var keys = [], values = [];
      return {
        size: 0,
        has: function (key) {
          return inArray(keys, key) > -1;
        },
        get: function (key) {
          return values[inArray(keys, key)];
        },
        set: function (key, value) {
          var i = inArray(keys, key);
          if (i === -1) {
            keys.push(key);
            values.push(value);
            this.size++;
          } else
            values[i] = value;
        },
        'delete': function (key) {
          var i = inArray(keys, key);
          if (i > -1) {
            keys.splice(i, 1);
            values.splice(i, 1);
            this.size--;
          }
        },
        forEach: function (callback) {
          for (var i = 0; i < keys.length; i++)
            callback.call(arguments[1], values[i], keys[i], this);
        }
      };
    } : function () {
      return new Map();
    }, getProps = O.getOwnPropertyNames ? function () {
      var func = O.getOwnPropertyNames;
      try {
        arguments.callee;
      } catch (e) {
        var avoid = (func(inArray).join(' ') + ' ').replace(/prototype |length |name /g, '').slice(0, -1).split(' ');
        if (avoid.length)
          func = function (object) {
            var props = O.getOwnPropertyNames(object);
            if (typeof object === 'function')
              for (var i = 0, j; i < avoid.length;)
                if ((j = inArray(props, avoid[i++])) > -1)
                  props.splice(j, 1);
            return props;
          };
      }
      return func;
    }() : function (object) {
      var props = [], prop, hop;
      if ('hasOwnProperty' in object) {
        for (prop in object)
          if (object.hasOwnProperty(prop))
            props.push(prop);
      } else {
        hop = O.hasOwnProperty;
        for (prop in object)
          if (hop.call(object, prop))
            props.push(prop);
      }
      if (isArray(object))
        props.push('length');
      return props;
    }, getPrototype = O.getPrototypeOf, getDescriptor = O.defineProperties && O.getOwnPropertyDescriptor, nextFrame = root.requestAnimationFrame || root.webkitRequestAnimationFrame || function () {
      var initial = +new Date(), last = initial;
      return function (func) {
        var now = +new Date();
        return setTimeout(function () {
          func((last = +new Date()) - initial);
        }, 17);
      };
    }(), doObserve = function (object, handler, acceptList) {
      var data = observed.get(object);
      if (data)
        setHandler(object, data, handler, acceptList);
      else {
        data = createObjectData(object);
        setHandler(object, data, handler, acceptList);
        if (observed.size === 1)
          nextFrame(runGlobalLoop);
      }
    }, createObjectData = function (object, data) {
      var props = getProps(object), values = [], descs, i = 0, data = {
          handlers: createMap(),
          frozen: O.isFrozen ? O.isFrozen(object) : false,
          extensible: O.isExtensible ? O.isExtensible(object) : true,
          proto: getPrototype && getPrototype(object),
          properties: props,
          values: values,
          notifier: retrieveNotifier(object, data)
        };
      if (getDescriptor) {
        descs = data.descriptors = [];
        while (i < props.length) {
          descs[i] = getDescriptor(object, props[i]);
          values[i] = object[props[i++]];
        }
      } else
        while (i < props.length)
          values[i] = object[props[i++]];
      observed.set(object, data);
      return data;
    }, performPropertyChecks = function () {
      var updateCheck = getDescriptor ? function (object, data, idx, except, descr) {
        var key = data.properties[idx], value = object[key], ovalue = data.values[idx], odesc = data.descriptors[idx];
        if ('value' in descr && (ovalue === value ? ovalue === 0 && 1 / ovalue !== 1 / value : ovalue === ovalue || value === value)) {
          addChangeRecord(object, data, {
            name: key,
            type: 'update',
            object: object,
            oldValue: ovalue
          }, except);
          data.values[idx] = value;
        }
        if (odesc.configurable && (!descr.configurable || descr.writable !== odesc.writable || descr.enumerable !== odesc.enumerable || descr.get !== odesc.get || descr.set !== odesc.set)) {
          addChangeRecord(object, data, {
            name: key,
            type: 'reconfigure',
            object: object,
            oldValue: ovalue
          }, except);
          data.descriptors[idx] = descr;
        }
      } : function (object, data, idx, except) {
        var key = data.properties[idx], value = object[key], ovalue = data.values[idx];
        if (ovalue === value ? ovalue === 0 && 1 / ovalue !== 1 / value : ovalue === ovalue || value === value) {
          addChangeRecord(object, data, {
            name: key,
            type: 'update',
            object: object,
            oldValue: ovalue
          }, except);
          data.values[idx] = value;
        }
      };
      var deletionCheck = getDescriptor ? function (object, props, proplen, data, except) {
        var i = props.length, descr;
        while (proplen && i--) {
          if (props[i] !== null) {
            descr = getDescriptor(object, props[i]);
            proplen--;
            if (descr)
              updateCheck(object, data, i, except, descr);
            else {
              addChangeRecord(object, data, {
                name: props[i],
                type: 'delete',
                object: object,
                oldValue: data.values[i]
              }, except);
              data.properties.splice(i, 1);
              data.values.splice(i, 1);
              data.descriptors.splice(i, 1);
            }
          }
        }
      } : function (object, props, proplen, data, except) {
        var i = props.length;
        while (proplen && i--)
          if (props[i] !== null) {
            addChangeRecord(object, data, {
              name: props[i],
              type: 'delete',
              object: object,
              oldValue: data.values[i]
            }, except);
            data.properties.splice(i, 1);
            data.values.splice(i, 1);
            proplen--;
          }
      };
      return function (data, object, except) {
        if (!data.handlers.size || data.frozen)
          return;
        var props, proplen, keys, values = data.values, descs = data.descriptors, i = 0, idx, key, value, proto, descr;
        if (data.extensible) {
          props = data.properties.slice();
          proplen = props.length;
          keys = getProps(object);
          if (descs) {
            while (i < keys.length) {
              key = keys[i++];
              idx = inArray(props, key);
              descr = getDescriptor(object, key);
              if (idx === -1) {
                addChangeRecord(object, data, {
                  name: key,
                  type: 'add',
                  object: object
                }, except);
                data.properties.push(key);
                values.push(object[key]);
                descs.push(descr);
              } else {
                props[idx] = null;
                proplen--;
                updateCheck(object, data, idx, except, descr);
              }
            }
            deletionCheck(object, props, proplen, data, except);
            if (!O.isExtensible(object)) {
              data.extensible = false;
              addChangeRecord(object, data, {
                type: 'preventExtensions',
                object: object
              }, except);
              data.frozen = O.isFrozen(object);
            }
          } else {
            while (i < keys.length) {
              key = keys[i++];
              idx = inArray(props, key);
              value = object[key];
              if (idx === -1) {
                addChangeRecord(object, data, {
                  name: key,
                  type: 'add',
                  object: object
                }, except);
                data.properties.push(key);
                values.push(value);
              } else {
                props[idx] = null;
                proplen--;
                updateCheck(object, data, idx, except);
              }
            }
            deletionCheck(object, props, proplen, data, except);
          }
        } else if (!data.frozen) {
          for (; i < props.length; i++) {
            key = props[i];
            updateCheck(object, data, i, except, getDescriptor(object, key));
          }
          if (O.isFrozen(object))
            data.frozen = true;
        }
        if (getPrototype) {
          proto = getPrototype(object);
          if (proto !== data.proto) {
            addChangeRecord(object, data, {
              type: 'setPrototype',
              name: '__proto__',
              object: object,
              oldValue: data.proto
            });
            data.proto = proto;
          }
        }
      };
    }(), runGlobalLoop = function () {
      if (observed.size) {
        observed.forEach(performPropertyChecks);
        handlers.forEach(deliverHandlerRecords);
        nextFrame(runGlobalLoop);
      }
    }, deliverHandlerRecords = function (hdata, handler) {
      if (hdata.changeRecords.length) {
        handler(hdata.changeRecords);
        hdata.changeRecords = [];
      }
    }, retrieveNotifier = function (object, data) {
      if (arguments.length < 2)
        data = observed.get(object);
      return data && data.notifier || {
        notify: function (changeRecord) {
          changeRecord.type;
          var data = observed.get(object);
          if (data) {
            var recordCopy = { object: object }, prop;
            for (prop in changeRecord)
              if (prop !== 'object')
                recordCopy[prop] = changeRecord[prop];
            addChangeRecord(object, data, recordCopy);
          }
        },
        performChange: function (changeType, func) {
          if (typeof changeType !== 'string')
            throw new TypeError('Invalid non-string changeType');
          if (typeof func !== 'function')
            throw new TypeError('Cannot perform non-function');
          var data = observed.get(object), prop, changeRecord, result = func.call(arguments[2]);
          data && performPropertyChecks(data, object, changeType);
          if (data && result && typeof result === 'object') {
            changeRecord = {
              object: object,
              type: changeType
            };
            for (prop in result)
              if (prop !== 'object' && prop !== 'type')
                changeRecord[prop] = result[prop];
            addChangeRecord(object, data, changeRecord);
          }
        }
      };
    }, setHandler = function (object, data, handler, acceptList) {
      var hdata = handlers.get(handler), odata;
      if (!hdata)
        handlers.set(handler, hdata = {
          observed: createMap(),
          changeRecords: []
        });
      hdata.observed.set(object, {
        acceptList: acceptList.slice(),
        data: data
      });
      data.handlers.set(handler, hdata);
    }, addChangeRecord = function (object, data, changeRecord, except) {
      data.handlers.forEach(function (hdata) {
        var acceptList = hdata.observed.get(object).acceptList;
        if ((typeof except !== 'string' || inArray(acceptList, except) === -1) && inArray(acceptList, changeRecord.type) > -1)
          hdata.changeRecords.push(changeRecord);
      });
    };
  observed = createMap();
  handlers = createMap();
  O.observe = function observe(object, handler, acceptList) {
    if (!object || typeof object !== 'object' && typeof object !== 'function')
      throw new TypeError('Object.observe cannot observe non-object');
    if (typeof handler !== 'function')
      throw new TypeError('Object.observe cannot deliver to non-function');
    if (O.isFrozen && O.isFrozen(handler))
      throw new TypeError('Object.observe cannot deliver to a frozen function object');
    if (arguments.length > 2) {
      if (!acceptList || typeof acceptList !== 'object')
        throw new TypeError('Object.observe cannot use non-object accept list');
    } else
      acceptList = defaultAcceptList;
    doObserve(object, handler, acceptList);
    return object;
  };
  O.unobserve = function unobserve(object, handler) {
    if (object === null || typeof object !== 'object' && typeof object !== 'function')
      throw new TypeError('Object.unobserve cannot unobserve non-object');
    if (typeof handler !== 'function')
      throw new TypeError('Object.unobserve cannot deliver to non-function');
    var hdata = handlers.get(handler), odata;
    if (hdata && (odata = hdata.observed.get(object))) {
      hdata.observed.forEach(function (odata, object) {
        performPropertyChecks(odata.data, object);
      });
      nextFrame(function () {
        deliverHandlerRecords(hdata, handler);
      });
      if (hdata.observed.size === 1 && hdata.observed.has(object))
        handlers['delete'](handler);
      else
        hdata.observed['delete'](object);
      if (odata.data.handlers.size === 1)
        observed['delete'](object);
      else
        odata.data.handlers['delete'](handler);
    }
    return object;
  };
  O.getNotifier = function getNotifier(object) {
    if (object === null || typeof object !== 'object' && typeof object !== 'function')
      throw new TypeError('Object.getNotifier cannot getNotifier non-object');
    if (O.isFrozen && O.isFrozen(object))
      return null;
    return retrieveNotifier(object);
  };
  O.deliverChangeRecords = function deliverChangeRecords(handler) {
    if (typeof handler !== 'function')
      throw new TypeError('Object.deliverChangeRecords cannot deliver to non-function');
    var hdata = handlers.get(handler);
    if (hdata) {
      hdata.observed.forEach(function (odata, object) {
        performPropertyChecks(odata.data, object);
      });
      deliverHandlerRecords(hdata, handler);
    }
  };
}(Object, Array, this);
bower_components_objectobserve_dist_object_observemin = undefined;
(function (Cash) {
  
  window.Cash = Cash;
}(cash_dom));
cash_domamdjs = undefined;
}());