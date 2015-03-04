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
            isValid: {
                value: function isValid(figure) {
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
                    var magnitudes = settings.magnitudeStrings.join("|"),
                        prefixes = settings.prefixes.join("|"),
                        suffixes = settings.suffixes.join("|"),
                        numberStr = settings.numberStrings.join("|"),

                    // work in progress; needs TLC:
                    regexStr = "(?:(?:(" + prefixes + ")\\s?)+[\\.\\b\\s]?)?" + "((\\d|" + numberStr + ")+(?:\\.|,)?)+\\s?" + "(?:(?:" + magnitudes + ")\\s?)*(?:(?:" + suffixes + ")\\s?)*",
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
                        if (_this.constructor.isValid(figure)) {
                            figure = " " + ("<span class=\"cash-node\">" + figure.trim() + "</span>").trim() + " ";
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