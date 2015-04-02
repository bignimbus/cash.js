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
  /**
   * Copyright (c) 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
   * additional grant of patent rights can be found in the PATENTS file in
   * the same directory.
   */
  !function (global) {
    
    var hasOwn = Object.prototype.hasOwnProperty;
    var undefined;
    // More compressible than void 0.
    var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator || '@@iterator';
    var inModule = typeof module === 'object';
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }
    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};
    function wrap(innerFn, outerFn, self, tryLocsList) {
      return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
    }
    runtime.wrap = wrap;
    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: 'normal',
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: 'throw',
          arg: err
        };
      }
    }
    var GenStateSuspendedStart = 'suspendedStart';
    var GenStateSuspendedYield = 'suspendedYield';
    var GenStateExecuting = 'executing';
    var GenStateCompleted = 'completed';
    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};
    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = 'GeneratorFunction';
    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === 'function' && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === 'GeneratorFunction' : false;
    };
    runtime.mark = function (genFun) {
      genFun.__proto__ = GeneratorFunctionPrototype;
      genFun.prototype = Object.create(Gp);
      return genFun;
    };
    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      return new Promise(function (resolve, reject) {
        var generator = wrap(innerFn, outerFn, self, tryLocsList);
        var callNext = step.bind(generator.next);
        var callThrow = step.bind(generator['throw']);
        function step(arg) {
          var record = tryCatch(this, null, arg);
          if (record.type === 'throw') {
            reject(record.arg);
            return;
          }
          var info = record.arg;
          if (info.done) {
            resolve(info.value);
          } else {
            Promise.resolve(info.value).then(callNext, callThrow);
          }
        }
        callNext();
      });
    };
    function Generator(innerFn, outerFn, self, tryLocsList) {
      var generator = outerFn ? Object.create(outerFn.prototype) : this;
      var context = new Context(tryLocsList);
      var state = GenStateSuspendedStart;
      function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error('Generator is already running');
        }
        if (state === GenStateCompleted) {
          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }
        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);
            if (record.type === 'throw') {
              context.delegate = null;
              // Like returning generator.throw(uncaught), but without the
              // overhead of an extra function call.
              method = 'throw';
              arg = record.arg;
              continue;
            }
            // Delegate generator ran and handled its own exceptions so
            // regardless of what the method was, we continue as if it is
            // "next" with an undefined arg.
            method = 'next';
            arg = undefined;
            var info = record.arg;
            if (info.done) {
              context[delegate.resultName] = info.value;
              context.next = delegate.nextLoc;
            } else {
              state = GenStateSuspendedYield;
              return info;
            }
            context.delegate = null;
          }
          if (method === 'next') {
            if (state === GenStateSuspendedStart && typeof arg !== 'undefined') {
              // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
              throw new TypeError('attempt to send ' + JSON.stringify(arg) + ' to newborn generator');
            }
            if (state === GenStateSuspendedYield) {
              context.sent = arg;
            } else {
              delete context.sent;
            }
          } else if (method === 'throw') {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw arg;
            }
            if (context.dispatchException(arg)) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              method = 'next';
              arg = undefined;
            }
          } else if (method === 'return') {
            context.abrupt('return', arg);
          }
          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);
          if (record.type === 'normal') {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;
            var info = {
              value: record.arg,
              done: context.done
            };
            if (record.arg === ContinueSentinel) {
              if (context.delegate && method === 'next') {
                // Deliberately forget the last sent value so that we don't
                // accidentally pass it on to the delegate.
                arg = undefined;
              }
            } else {
              return info;
            }
          } else if (record.type === 'throw') {
            state = GenStateCompleted;
            if (method === 'next') {
              context.dispatchException(record.arg);
            } else {
              arg = record.arg;
            }
          }
        }
      }
      generator.next = invoke.bind(generator, 'next');
      generator['throw'] = invoke.bind(generator, 'throw');
      generator['return'] = invoke.bind(generator, 'return');
      return generator;
    }
    Gp[iteratorSymbol] = function () {
      return this;
    };
    Gp.toString = function () {
      return '[object Generator]';
    };
    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };
      if (1 in locs) {
        entry.catchLoc = locs[1];
      }
      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }
      this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = 'normal';
      delete record.arg;
      entry.completion = record;
    }
    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: 'root' }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset();
    }
    runtime.keys = function (object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();
      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }
        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }
        if (typeof iterable.next === 'function') {
          return iterable;
        }
        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }
              next.value = undefined;
              next.done = true;
              return next;
            };
          return next.next = next;
        }
      }
      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;
    function doneResult() {
      return {
        value: undefined,
        done: true
      };
    }
    Context.prototype = {
      constructor: Context,
      reset: function reset() {
        this.prev = 0;
        this.next = 0;
        this.sent = undefined;
        this.done = false;
        this.delegate = null;
        this.tryEntries.forEach(resetTryEntry);
        // Pre-initialize at least 20 temporary variables to enable hidden
        // class optimizations for simple generators.
        for (var tempIndex = 0, tempName; hasOwn.call(this, tempName = 't' + tempIndex) || tempIndex < 20; ++tempIndex) {
          this[tempName] = null;
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === 'throw') {
          throw rootRecord.arg;
        }
        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }
        var context = this;
        function handle(loc, caught) {
          record.type = 'throw';
          record.arg = exception;
          context.next = loc;
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;
          if (entry.tryLoc === 'root') {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle('end');
          }
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, 'catchLoc');
            var hasFinally = hasOwn.call(entry, 'finallyLoc');
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error('try statement without catch or finally');
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, 'finallyLoc') && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        if (finallyEntry && (type === 'break' || type === 'continue') && finallyEntry.tryLoc <= arg && arg < finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }
        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;
        if (finallyEntry) {
          this.next = finallyEntry.finallyLoc;
        } else {
          this.complete(record);
        }
        return ContinueSentinel;
      },
      complete: function complete(record, afterLoc) {
        if (record.type === 'throw') {
          throw record.arg;
        }
        if (record.type === 'break' || record.type === 'continue') {
          this.next = record.arg;
        } else if (record.type === 'return') {
          this.rval = record.arg;
          this.next = 'end';
        } else if (record.type === 'normal' && afterLoc) {
          this.next = afterLoc;
        }
        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            return this.complete(entry.completion, entry.afterLoc);
          }
        }
      },
      'catch': function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === 'throw') {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error('illegal catch attempt');
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };
        return ContinueSentinel;
      }
    };
  }(// Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === 'object' ? global : typeof window === 'object' ? window : undefined);
  exports = Object;
  return exports;
}({});
settings = function (exports, _polyfills) {
  
  exports = Settings;
  function Settings(overrides, isDom) {
    Object.assign(this, {
      'default': 'USD',
      current: 'USD',
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
          magnitudes: ['cent[s]?'],
          value: 1
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
        },
        MXN: {
          prefixes: [
            'MXN',
            'Mgex\\$',
            '\\$'
          ],
          suffixes: [
            'MXN',
            'Mex\\$',
            '\\$',
            '(?:Mexic(?:o|an)\\s)?peso[s]?'
          ],
          magnitudes: [
            'centavo',
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
            '(?:Brazil(?:ian)?\\s)?real(?:es)?'
          ],
          magnitudes: [
            'centavo',
            'cent[s]?'
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
          var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
            return this.currencies[currency].prefixes.length && this.currencies[currency].suffixes.length && this.currencies[currency].value !== void 0;
          }, this);
          if (validCurrencies.length) {
            return validCurrencies;
          }
          throw new Error('no valid currencies detected!');
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
            throw new Error('suffixes must be expressed as an array of strings');
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
        value: function formHash(figure, register) {
          var parseNums = function (num) {
              if (!isNaN(+num)) {
                return +num;
              }
              return register.numberWords[num] || -1;
            }, nums = new RegExp('(?:\\d|' + register.numberStrings.join('|') + '|\\.|,)+', 'gi'), multipliers = new RegExp('(?:' + register.magnitudeStrings.join('|') + ')+', 'gi'), hash = {
              currency: register.current,
              rate: register.currencies[register.current].value || 1,
              str: figure,
              coefficient: parseNums(figure.match(nums)[0].replace(',', '').trim()),
              magnitude: (figure.match(multipliers) || []).map(function (mul) {
                mul = mul.trim();
                if (register.magnitudeAbbreviations[mul]) {
                  mul = register.magnitudeAbbreviations[mul];
                }
                return register.magnitudes[mul] || 1;
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
      isValid: {
        value: function isValid(figure, register) {
          var currencyStr = [].concat(register.prefixes, register.suffixes, register.specialMagnitudes), hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'), isValidStr = hasCurrencySpec.test(figure) && register.filters.every(function (filter) {
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
        },
        writable: true,
        configurable: true
      },
      setValues: {
        value: function setValues(hash) {
          // always make the default currency worth 1
          if (!(hash instanceof Object)) {
            throw new Error('exchange rates must be passed as an object, e.g.{"USD": 1, "EUR": 0.92}');
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
      _get(Object.getPrototypeOf(CashDom.prototype), 'constructor', this).call(this, options, true);
    }
    _inherits(CashDom, Cash);
    _prototypeProperties(CashDom, {
      exchange: {
        value: function exchange(currency) {
          var obj = undefined, rate = undefined, cache = this.register.metadata;
          for (id in cache) {
            obj = {};
            rate = this.register.currencies[currency].value;
            Object.assign(cache[id], {
              currency: currency,
              rate: rate,
              exactValue: cache[id].exactValue * rate
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