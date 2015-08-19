define(["exports", "module", "register", "cashex"], function (exports, module, _register, _cashex) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Register = _interopRequire(_register);

    var CashEx = _interopRequire(_cashex);

    var Cash = (function () {
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

                // TODO actually implement cashex

                value: function tag(html) {
                    var _this = this;

                    var moneyStrings = this.constructor.buildRegex(this.register),
                        wrapped = html.replace(moneyStrings, function (figure) {
                        var trimmed = figure.trim();
                        if (_this.constructor.isValid.call(_this, trimmed)) {
                            var cashex = new CashEx(trimmed, _this.register);
                            // console.log(JSON.stringify(cashex), null, 4);
                            _this.register.cache = cashex;
                            figure = " <span id=\"" + cashex.guid + "\" class=\"cash-node\">" + trimmed + "</span> ";
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
                        return typeof filter === "function";
                    });
                    this.register.filters = this.register.filters.concat(filters);
                    return this;
                }
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
                }
            },
            setLocale: {
                value: function setLocale(locale) {
                    this.register.formatting.locale = locale;
                    return this;
                }
            }
        }, {
            isValid: {
                value: function isValid(figure) {
                    var currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes),
                        hasCurrencySpec = new RegExp("(?:" + currencyStr.join("|") + ")", "i"),
                        isValidStr = hasCurrencySpec.test(figure) && this.register.filters.every(function (filter) {
                        return filter(figure);
                    });
                    return isValidStr;
                }
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
                }
            }
        });

        return Cash;
    })();

    module.exports = Cash;
});