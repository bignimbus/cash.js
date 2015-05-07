define(["exports", "module", "polyfills", "currencies"], function (exports, module, _polyfills, _currencies) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    module.exports = Register;

    var currencies = _interopRequire(_currencies);

    function format(obj, opts) {
        var cents = opts.round ? 0 : 2;
        return obj.exactValue.toLocaleString(opts.locale, {
            minimumFractionDigits: cents,
            maximumFractionDigits: cents,
            useGrouping: opts.useGrouping
        });
    }

    function Register(overrides, isDom) {
        Object.assign(this, currencies(), overrides);

        Object.defineProperties(this, {
            supportedCurrencies: {
                get: function get() {
                    var _this = this;

                    var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
                        return _this.currencies[currency].prefixes.length && _this.currencies[currency].suffixes.length && _this.currencies[currency].value !== void 0;
                    });
                    if (validCurrencies.length) {
                        return validCurrencies;
                    }
                    throw new Error("no valid currencies detected!");
                }
            },
            prefixes: {
                get: function get() {
                    var _this = this;

                    var prefixes = [];
                    this.supported.forEach((function (currency) {
                        prefixes = prefixes.concat(_this.currencies[currency].prefixes || []);
                    }).bind(this));
                    return prefixes;
                }
            },
            suffixes: {
                get: function get() {
                    var _this = this;

                    var suffixes = [];
                    this.supported.forEach((function (currency) {
                        suffixes = suffixes.concat(_this.currencies[currency].suffixes || []);
                    }).bind(this));
                    return suffixes;
                }
            },
            specialMagnitudes: {
                get: function get() {
                    var _this = this;

                    var magnitudes = [];
                    this.supported.forEach((function (currency) {
                        magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
                    }).bind(this));
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
                set: function set(arr) {
                    var _this = this;

                    var guid = arr[0],
                        hash = arr[1];

                    hash.id = guid;
                    this.metadata[guid] = hash;
                    if (isDom) {
                        Object.observe(this.metadata[guid], function (obj) {
                            obj = obj[0].object;
                            var display = format(obj, _this.formatting);
                            $("#" + obj.id).html("" + obj.currency + " " + display);
                        });
                    }
                }
            }
        });

        return this;
    }
});