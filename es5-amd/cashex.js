define(["exports", "module"], function (exports, module) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    function format(obj, opts) {
        "use strict";
        var cents = opts.round ? 0 : 2;
        return obj.exactValue.toLocaleString(opts.locale, {
            minimumFractionDigits: cents,
            maximumFractionDigits: cents,
            useGrouping: opts.useGrouping
        });
    }

    var CashEx = (function () {
        function CashEx(str, register) {
            _classCallCheck(this, CashEx);

            this.raw = str;
            this.register = register;
            this.guid = (Math.random() + 1).toString(36).substring(7);
            this.analyze(this.raw);
            if (this.register.isDom) {
                Object.observe(this, this.updateDom.bind(this));
            }
        }

        _createClass(CashEx, {
            analyze: {
                value: function analyze(figure) {
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
                        prefixed: currency.index < figure.indexOf(nums),
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

                    var index = undefined,
                        match = undefined,
                        regex = undefined,
                        found = undefined,
                        candidate = undefined,
                        currentCandidate = undefined,
                        currencies = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes);
                    currencies = "(?:" + currencies.join("|") + ")";
                    regex = new RegExp(currencies, "i");
                    match = figure.match(regex)[0];
                    this.register.supported.forEach(function (currency) {
                        var current = _this.register.currencies[currency],
                            symbols = [].concat(current.prefixes, current.suffixes, current.magnitudes || []);
                        symbols = new RegExp("(?:" + symbols.join("|") + ")", "i"), candidate = match.match(symbols);
                        candidate = candidate ? candidate[0] : candidate;
                        if (candidate) {
                            if (currentCandidate) {
                                found = candidate.length > currentCandidate.length ? currency : found;
                            } else {
                                found = currency;
                            }
                            currentCandidate = candidate;
                            index = figure.indexOf(match);
                        }
                    });
                    return {
                        code: found,
                        index: index
                    };
                }
            },
            recalculate: {
                value: function recalculate(currency) {
                    var oldRate = currency ? this.register.currencies[this.currency].value : 1,
                        current = currency || this.currency,
                        rate = this.register.currencies[current].value,
                        multiplier = 1 / oldRate;
                    Object.assign(this, {
                        currency: current,
                        rate: rate,
                        exactValue: this.exactValue * multiplier * rate
                    });
                }
            },
            updateDom: {
                value: function updateDom(obj) {
                    obj = obj[0].object;
                    var display = format(obj, this.register.formatting);
                    $("#" + obj.guid).html("" + obj.currency + " " + display);
                }
            }
        });

        return CashEx;
    })();

    module.exports = CashEx;
});