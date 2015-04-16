define(["exports", "module", "register"], function (exports, module, _register) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Register = _interopRequire(_register);

    var Cash = (function () {
        function Cash(options, isDom) {
            _classCallCheck(this, Cash);

            options = options || {};
            this.register = new Register(options.overrides || {}, isDom || false);
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

                    var currency = this.constructor.inferCurrency.call(this, figure),
                        parseNums = function (num) {
                        if (!isNaN(+num)) {
                            return +num;
                        }
                        return _this.register.numberWords[num] || 1;
                    },
                        nums = new RegExp("(?:\\d|" + this.register.numberStrings.join("|") + "|\\.|,)+", "gi"),
                        multipliers = new RegExp("(?:" + this.register.magnitudeStrings.join("|") + ")+", "gi"),
                        hash = {
                        currency: currency,
                        rate: this.register.currencies[currency].value || 1,
                        str: figure,
                        coefficient: parseNums(figure.match(nums)[0].replace(",", "").trim()),
                        magnitude: (figure.match(multipliers) || []).map(function (mul) {
                            mul = mul.trim();
                            if (_this.register.magnitudeAbbreviations[mul]) {
                                mul = _this.register.magnitudeAbbreviations[mul];
                            }
                            return _this.register.magnitudes[mul] || 1;
                        }) };
                    hash.exactValue = (function () {
                        var val = hash.coefficient * hash.rate;
                        hash.magnitude.forEach(function (factor) {
                            val *= factor;
                        });
                        return val;
                    })();

                    return hash;
                },
                writable: true,
                configurable: true
            },
            inferCurrency: {
                value: function inferCurrency(figure) {
                    var _this = this;

                    var match = undefined,
                        regex = undefined,
                        found = undefined,
                        currencies = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes);
                    currencies = "(?:" + currencies.join("|") + ")";
                    regex = new RegExp(currencies, "i");
                    match = figure.match(regex)[0];
                    this.register.supported.forEach(function (currency) {
                        var current = _this.register.currencies[currency],
                            symbols = [].concat(current.prefixes, current.suffixes, current.magnitudes || []);
                        symbols = new RegExp("(?:" + symbols.join("|") + ")", "i");
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
                    var currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes),
                        hasCurrencySpec = new RegExp("(?:" + currencyStr.join("|") + ")", "i"),
                        isValidStr = hasCurrencySpec.test(figure) && this.register.filters.every(function (filter) {
                        return filter(figure);
                    });
                    return isValidStr;
                },
                writable: true,
                configurable: true
            },
            buildRegex: {
                value: function buildRegex(keywords) {
                    var magnitudes = keywords.magnitudeStrings.join("|"),
                        prefixes = keywords.prefixes.join("|"),
                        suffixes = [].concat(keywords.suffixes, keywords.specialMagnitudes).join("|"),
                        numberStr = keywords.numberStrings.join("|"),

                    // work in progress; needs TLC:
                    regexStr = "(?:(?:(" + prefixes + ")\\s?)+" + "[\\.\\b\\s]?" + ")?" + "((\\d|" + numberStr + ")+(?:\\.|,)?)" + "+\\s?" + "(?:(?:" + magnitudes + ")\\s?)*" + "(?:(?:" + suffixes + ")\\s?)*",
                        regex = new RegExp(regexStr, "ig");
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

                    var moneyStrings = this.constructor.buildRegex(this.register),
                        wrapped = html.replace(moneyStrings, function (figure) {
                        figure = figure.trim();
                        if (_this.constructor.isValid.call(_this, figure)) {
                            var guid = _this.constructor.generateGuid(),
                                hash = _this.constructor.formHash.call(_this, figure);
                            _this.register.cache = [guid, hash];
                            figure = " <span id=\"" + guid + "\" class=\"cash-node\">" + figure + "</span> ";
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
                        return typeof filter === "function";
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
                        throw new Error("exchange rates must be passed as an object, e.g.{\"USD\": 1, \"EUR\": 0.92}");
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
    })();

    module.exports = Cash;
});