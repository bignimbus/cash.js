define(["exports", "module", "polyfills", "currencies"], function (exports, module, _polyfills, _currencies) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var currencies = _interopRequire(_currencies);

    var Register = (function () {
        function Register(overrides, isDom) {
            _classCallCheck(this, Register);

            Object.assign(this, currencies(), overrides, {
                isDom: isDom
            });
            Object.defineProperties(this, {
                supportedCurrencies: {
                    get: function get() {
                        var _this = this;

                        var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
                            return Object.keys(_this.currencies[currency].prefixes).length && Object.keys(_this.currencies[currency].suffixes).length && _this.currencies[currency].value !== void 0;
                        });
                        if (validCurrencies.length) {
                            return validCurrencies;
                        }
                        throw new Error("no valid currencies detected!");
                    }
                },
                specialMagnitudes: {
                    get: function get() {
                        var _this = this;

                        var magnitudes = [];
                        this.supported.forEach(function (currency) {
                            magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
                        }, this);
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
                    set: function set(cashexp) {
                        var guid = cashexp.guid,
                            hash = cashexp;

                        hash.guid = guid;
                        this.metadata[guid] = hash;
                    }
                }
            });
        }

        _createClass(Register, {
            getPrefixes: {
                value: function getPrefixes() {
                    var _this = this;

                    for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
                        currencies[_key] = arguments[_key];
                    }

                    if (!currencies.length) {
                        currencies = this.supported;
                    }
                    var prefixes = [];
                    currencies.forEach(function (currency) {
                        if (!_this.currencies[currency]) {
                            return;
                        }
                        for (var i in _this.currencies[currency].prefixes) {
                            var thing = _this.currencies[currency].prefixes[i];
                            prefixes = [].concat(prefixes, thing || []);
                        }
                    });
                    return prefixes;
                }
            },
            getSuffixes: {
                value: function getSuffixes() {
                    var _this = this;

                    for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
                        currencies[_key] = arguments[_key];
                    }

                    if (!currencies.length) {
                        currencies = this.supported;
                    }
                    var suffixes = [];
                    currencies.forEach(function (currency) {
                        if (!_this.currencies[currency]) {
                            return;
                        }
                        for (var i in _this.currencies[currency].suffixes) {
                            suffixes = suffixes.concat(_this.currencies[currency].suffixes[i] || []);
                        }
                    });
                    return suffixes;
                }
            }
        });

        return Register;
    })();

    module.exports = Register;
});