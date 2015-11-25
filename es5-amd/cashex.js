define(["exports", "module"], function (exports, module) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var CashEx = (function () {
        function CashEx(str, register) {
            _classCallCheck(this, CashEx);

            this.raw = str;
            this.data = {};
            this.register = register;
            this.guid = (Math.random() + 1).toString(36).substring(7);
            this.analyze();
        }

        _createClass(CashEx, {
            analyze: {
                value: function analyze() {
                    var _this = this;

                    var currency = this.inferCurrency(this.raw),
                        parseNums = function (num) {
                        if (!isNaN(+num)) {
                            return +num;
                        }
                        return _this.register.numberWords[num] || 1;
                    },
                        nums = this.raw.match(new RegExp("(?:\\d|" + this.register.numberStrings.join("|") + "|\\.|,)+", "gi"))[0],
                        multipliers = new RegExp("(?:" + this.register.magnitudeStrings.join("|") + ")+", "gi");

                    Object.assign(this, {
                        currency: currency.code,
                        rate: this.register.currencies[currency.code].value || 1,
                        str: this.raw,
                        prefixed: currency.index < this.raw.indexOf(nums),
                        coefficient: parseNums(nums.replace(",", "").trim()),
                        magnitude: (this.raw.match(multipliers) || []).map(function (mul) {
                            mul = mul.trim();
                            if (_this.register.magnitudeAbbreviations[mul]) {
                                mul = _this.register.magnitudeAbbreviations[mul];
                            }
                            return _this.register.magnitudes[mul] || 1;
                        }) });

                    this.exactValue = (function () {
                        var val = _this.coefficient;
                        _this.magnitude.forEach(function (factor) {
                            val *= factor;
                        });
                        return val;
                    })();

                    this.voice = this.inferVoice();
                }
            },
            inferVoice: {
                value: function inferVoice() {
                    var obj = this.register.currencies[this.currency],
                        choices = this.prefixed ? obj.prefixes : obj.suffixes;

                    for (var i in choices) {
                        var str = "(?:" + choices[i].join("|") + ")",
                            regex = new RegExp(str, "i");

                        if (regex.test(this.raw)) {
                            return i;
                        }
                    }
                    if (!this.prefixed) {
                        var str = obj.magnitudes.join("|"),
                            regex = new RegExp(str, "i");

                        if (regex.test(this.raw)) {
                            return "conversational";
                        }
                    }
                    return "formal";
                }
            },
            inferCurrency: {
                value: function inferCurrency() {
                    var _this = this;

                    var index = undefined,
                        match = undefined,
                        regex = undefined,
                        found = undefined,
                        candidate = undefined,
                        currentCandidate = undefined,
                        currencies = [].concat(this.register.getPrefixes(), this.register.getSuffixes(), this.register.specialMagnitudes);
                    currencies = "(?:" + currencies.join("|") + ")";
                    regex = new RegExp(currencies, "i");
                    match = this.raw.match(regex)[0];
                    this.register.supported.forEach(function (currency) {
                        var candidate = undefined,
                            current = _this.register.currencies[currency],
                            symbols = [].concat(_this.register.getPrefixes(currency), _this.register.getSuffixes(currency), current.magnitudes || []);
                        symbols = new RegExp("(?:" + symbols.join("|") + ")", "i");
                        candidate = match.match(symbols);
                        candidate = candidate ? candidate[0] : candidate;
                        if (candidate) {
                            if (currentCandidate) {
                                found = candidate.length > currentCandidate.length ? currency : found;
                            } else {
                                found = currency;
                            }
                            currentCandidate = candidate;
                            candidate = null;
                            index = _this.raw.indexOf(match);
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
                    if (this.register.isDom) {
                        this.updateDom();
                    }
                }
            },
            updateDom: {
                value: function updateDom(obj) {
                    var obj = this.register.currencies[this.currency].translations,
                        str = obj[this.voice] || this.currency,
                        order = [this.format(), str];
                    if (this.prefixed) {
                        order.reverse();
                    }
                    str = order.join(this.voice === "symbolic" ? "" : " ").replace(/\\/g, "");
                    $("#" + this.guid).html(str);
                }
            },
            format: {
                value: function format() {
                    "use strict";
                    var cents = this.register.formatting.round ? 0 : 2;
                    return this.exactValue.toLocaleString(this.register.formatting.locale, {
                        minimumFractionDigits: cents,
                        maximumFractionDigits: cents,
                        useGrouping: this.register.formatting.useGrouping
                    });
                }
            }
        });

        return CashEx;
    })();

    module.exports = CashEx;
});