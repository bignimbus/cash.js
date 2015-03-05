define(["exports", "module", "settings"], function (exports, module, _settings) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Settings = _interopRequire(_settings);

    var Cash = (function () {
        function Cash(options) {
            _classCallCheck(this, Cash);

            options = options || {};
            this.settings = new Settings(options.overrides || {});
        }

        _prototypeProperties(Cash, {
            cache: {
                value: function cache(guid, hash) {
                    var obj = {};
                    hash.exactValue = (function () {
                        var val = hash.coefficient;
                        hash.magnitude.forEach(function (factor) {
                            val *= factor;
                        });
                        return val;
                    })();
                    obj[guid] = hash;
                    return obj;
                },
                writable: true,
                configurable: true
            },
            isValid: {
                value: function isValid(figure) {
                    return figure.length > 1 && /\D/.test(figure);
                    // when filter support is implemented...
                    // return this.settings.filters.every((filter) => {
                    //     return filter(figure);
                    // });
                },
                writable: true,
                configurable: true
            },
            buildRegex: {
                value: function buildRegex(settings) {
                    var magnitudes = settings.magnitudeStrings.join("|"),
                        prefixes = settings.prefixes.join("|"),
                        suffixes = settings.suffixes.join("|"),
                        numberStr = settings.numberStrings.join("|"),

                    // work in progress; needs TLC:
                    regexStr = "(?:(?:(" + prefixes + ")\\s?)+" + "[\\.\\b\\s]?" + ")?" + "((\\d|" + numberStr + ")+(?:\\.|,)?)" + "+\\s?" + "(?:(?:" + magnitudes + ")\\s?)*" + "(?:(?:" + suffixes + ")\\s?)*",
                        regex = new RegExp(regexStr, "ig");
                    return regex;
                },
                writable: true,
                configurable: true
            }
        }, {
            addTags: {
                value: function addTags(html) {
                    var _this = this;

                    var moneyStrings = this.constructor.buildRegex(this.settings),
                        wrapped = html.replace(moneyStrings, function (figure) {
                        figure = figure.trim();
                        if (_this.constructor.isValid(figure)) {
                            var guid = _this.register(figure);
                            figure = " " + ("<span id=\"" + guid + "\" class=\"cash-node\">" + figure + "</span>").trim() + " ";
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
                    guid = (Math.random() + 1).toString(36).substring(7),
                        nums = new RegExp("(?:\\d|" + this.settings.numberStrings.join("|") + "|\\.|,)+", "gi"),
                        multipliers = new RegExp("(?:" + this.settings.magnitudeStrings.join("|") + ")+", "gi");

                    this.settings.register = this.constructor.cache(guid, {
                        str: figure,
                        coefficient: parseNums(figure.match(nums)[0].replace(",", "").trim()),
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
    })();

    module.exports = Cash;
});