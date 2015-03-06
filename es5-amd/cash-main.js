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
            this.register = new Settings(options.overrides || {});
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
                value: function formHash(figure, keywords) {
                    var parseNums = function (num) {
                        if (!isNaN(+num)) {
                            return +num;
                        }
                        return keywords.numberWords[num] || -1;
                    },
                        nums = new RegExp("(?:\\d|" + keywords.numberStrings.join("|") + "|\\.|,)+", "gi"),
                        multipliers = new RegExp("(?:" + keywords.magnitudeStrings.join("|") + ")+", "gi");

                    return {
                        str: figure,
                        coefficient: parseNums(figure.match(nums)[0].replace(",", "").trim()),
                        magnitude: (figure.match(multipliers) || []).map(function (mul) {
                            mul = mul.trim();
                            if (keywords.magnitudeAbbreviations[mul]) {
                                mul = keywords.magnitudeAbbreviations[mul];
                            }
                            return keywords.magnitudes[mul] || 1;
                        })
                    };
                },
                writable: true,
                configurable: true
            },
            compute: {
                value: function compute(guid, hash) {
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
                    // return this.register.filters.every((filter) => {
                    //     return filter(figure);
                    // });
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
                        if (_this.constructor.isValid(figure)) {
                            var guid = _this.constructor.generateGuid(),
                                hash = _this.constructor.formHash(figure, _this.register);
                            _this.register.cache = _this.constructor.compute(guid, hash);
                            figure = " <span id=\"" + guid + "\" class=\"cash-node\">" + figure + "</span> ";
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
    })();

    module.exports = Cash;
});