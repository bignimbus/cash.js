define(["exports", "module"], function (exports, module) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var CashEx = (function () {
        function CashEx(str, register) {
            _classCallCheck(this, CashEx);

            this.raw = str;
            this.register = register;
            this.guid = (Math.random() + 1).toString(36).substring(7);
            this.formHash(this.raw);
        }

        _createClass(CashEx, {
            formHash: {
                value: function formHash(figure) {
                    var _this = this;

                    var currency = this.inferCurrency(figure),
                        parseNums = function (num) {
                        if (!isNaN(+num)) {
                            return +num;
                        }
                        return _this.register.numberWords[num] || 1;
                    },
                        nums = figure.match(new RegExp("(?:\\d|" + this.register.numberStrings.join("|") + "|\\.|,)+", "gi"))[0],
                        multipliers = new RegExp("(?:" + this.register.magnitudeStrings.join("|") + ")+", "gi"),
                        hash = {
                        currency: currency.code,
                        rate: this.register.currencies[currency.code].value || 1,
                        str: figure,
                        prefix: currency.index < figure.indexOf(nums),
                        coefficient: parseNums(nums.replace(",", "").trim()),
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

                    Object.assign(this, hash);
                }
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
                            index = figure.indexOf(match);
                        }
                    });
                    return {
                        code: found,
                        index: figure.indexOf(match)
                    };
                }
            }
        });

        return CashEx;
    })();

    module.exports = CashEx;
});