define(["exports", "module", "settings"], function (exports, module, _settings) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Settings = _interopRequire(_settings);

    var Cash = (function () {
        function Cash(options, isDom) {
            _classCallCheck(this, Cash);

            options = options || {};
            this.register = new Settings(options.overrides || {}, isDom || false);
            this.register.current = this.register["default"];
            this.register.currencies[this.register.current].value = 1;
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
                    },
                        nums = new RegExp("(?:\\d|" + register.numberStrings.join("|") + "|\\.|,)+", "gi"),
                        multipliers = new RegExp("(?:" + register.magnitudeStrings.join("|") + ")+", "gi"),
                        hash = {
                        currency: register.current,
                        rate: register.currencies[register.current].value || 1,
                        str: figure,
                        coefficient: parseNums(figure.match(nums)[0].replace(",", "").trim()),
                        magnitude: (figure.match(multipliers) || []).map(function (mul) {
                            mul = mul.trim();
                            if (register.magnitudeAbbreviations[mul]) {
                                mul = register.magnitudeAbbreviations[mul];
                            }
                            return register.magnitudes[mul] || 1;
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
            isValid: {
                value: function isValid(figure, register) {
                    var currencyStr = [].concat(register.prefixes, register.suffixes, register.specialMagnitudes),
                        hasCurrencySpec = new RegExp("(?:" + currencyStr.join("|") + ")", "i"),
                        isValidStr = hasCurrencySpec.test(figure) && register.filters.every(function (filter) {
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
                        suffixes = keywords.suffixes.join("|"),
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
            tag: {
                value: function tag(html) {
                    var _this = this;

                    var moneyStrings = this.constructor.buildRegex(this.register),
                        wrapped = html.replace(moneyStrings, function (figure) {
                        figure = figure.trim();
                        if (_this.constructor.isValid(figure, _this.register)) {
                            var guid = _this.constructor.generateGuid(),
                                hash = _this.constructor.formHash(figure, _this.register);
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
                    // always make the default currency worth 1
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