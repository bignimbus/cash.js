define(["exports", "module"], function (exports, module) {
    "use strict";

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Settings = (function () {
        function Settings(overrides) {
            _classCallCheck(this, Settings);

            $.extend(true, this, {
                "default": "USD",
                supportedCurrencies: [],
                currencies: {
                    USD: {
                        prefixes: ["USD", "\\$"],
                        suffixes: ["USD", "\\$", "bucks", "(?:(?:US[A]?|American)\\s)?dollar[s]?"]
                    },
                    GBP: {
                        prefixes: ["GBP", "£"],
                        suffixes: ["GBP", "£", "quid", "pound[s]?"]
                    },
                    EUR: {
                        prefixes: ["EUR", "€"],
                        suffixes: ["EUR", "€", "euro[s]?"]
                    },
                    JPY: {
                        prefixes: ["JPY", "¥"],
                        suffixes: ["JPY", "¥", "(?:Japan(?:ese)?\\s)?yen"]
                    },
                    CNY: {
                        prefixes: ["CNY", "yuan", "¥"],
                        suffixes: ["CNY", "yuan", "¥", "(?:Chin(?:a|ese)\\s)?renminbi"]
                    },
                    RUB: {
                        prefixes: ["RUB", "руб"],
                        suffixes: ["RUB", "руб", "(?:Russia[n]?\\s)?ruble[s]?"]
                    },
                    CAD: {
                        prefixes: ["CAD", "\\$"],
                        suffixes: ["CAD", "\\$", "buck[s]?", "(?:Canad(?:a|ian)\\s)?dollar[s]?"]
                    },
                    AUD: {
                        prefixes: ["AUD", "\\$"],
                        suffixes: ["AUD", "\\$", "buck[s]?", "(?:Australia[n]?\\s)?dollar[s]?"]
                    },
                    INR: {
                        prefixes: ["INR", "Rs\\.?"],
                        suffixes: ["INR", "Rs\\.?", "(?:India(?:n)\\s)?rupee[s]?"]
                    }
                },
                magnitudes: {
                    pence: 0.01,
                    paise: 0.01,
                    cents: 0.01,
                    hundred: 100,
                    thousand: 1000,
                    grand: 1000,
                    lakh: 100000,
                    "mil(?:lion)?": 1000000,
                    crore: 10000000,
                    "bil(?:lion)?": 1000000000,
                    "tril(?:lion)?": 1000000000000
                },
                numberWords: {
                    a: 1,
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4,
                    five: 5,
                    six: 6,
                    seven: 7,
                    eight: 8,
                    nine: 9,
                    ten: 10,
                    eleven: 11,
                    twelve: 12,
                    thirteen: 13,
                    fourteen: 14,
                    fifteen: 15,
                    sixteen: 16
                }
                // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
            }, overrides);
        }

        _prototypeProperties(Settings, null, {
            supportedCurrencies: {
                get: function () {
                    var currencies = this.supportedCurrencies.indexOf(this["default"]) ? this.supportedCurrencies : this.supportedCurrencies.concat(this["default"]);
                    return currencies;
                }
                //     "set": (currencies) => {
                //         if (currencies instanceof Array) {
                //             this.supportedCurrencies = currencies;
                //         } else {
                //             throw new Error('currencies must be expressed as an array of strings');
                //         }
                //     }
                // },
                // "prefixes": {
                //     "get": function () {
                //         return this.currencies[this.default].prefixes;
                //     },
                //     "set": (prefixes) => {
                //         if (prefixes instanceof Array) {
                //             this.currencies[this.default].prefixes = prefixes;
                //         } else {
                //             throw new Error('prefixes must be expressed as an array of strings');
                //         }
                //     }
                // },
                // "suffixes": {
                //     "get": () => this.currencies[this.default].suffixes,
                //     "set": (suffixes) => {
                //         if (suffixes instanceof Array) {
                //             this.currencies[this.default].suffixes = suffixes;
                //         } else {
                //             throw new Error('prefixes must be expressed as an array of strings');
                //         }
                //     }
                // }
                ,
                configurable: true
            }
        });

        return Settings;
    })();

    module.exports = Settings;
});