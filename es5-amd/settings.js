define(["exports", "module", "polyfills"], function (exports, module, _polyfills) {
    "use strict";

    module.exports = Settings;
    function Settings(overrides, isDom) {
        Object.assign(this, {
            "default": "USD",
            current: "USD",
            currencies: {
                USD: {
                    prefixes: ["USD", "\\$"],
                    suffixes: ["USD", "\\$", "bucks", "(?:(?:US[A]?|American)\\s)?dollar[s]?"],
                    magnitudes: ["cent[s]?"],
                    value: 1
                },
                GBP: {
                    prefixes: ["GBP", "£"],
                    suffixes: ["GBP", "£", "quid", "pound[s]?"],
                    magnitudes: ["pence"]
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
                    suffixes: ["CAD", "\\$", "buck[s]?", "(?:Canad(?:a|ian)\\s)?dollar[s]?"],
                    magnitudes: ["cent[s]?"]
                },
                AUD: {
                    prefixes: ["AUD", "\\$"],
                    suffixes: ["AUD", "\\$", "buck[s]?", "(?:Australia[n]?\\s)?dollar[s]?"],
                    magnitudes: ["cent[s]?"]
                },
                INR: {
                    prefixes: ["INR", "Rs\\.?"],
                    suffixes: ["INR", "Rs\\.?", "(?:India(?:n)\\s)?rupee[s]?"],
                    magnitudes: ["paise", "lakh", "crore"]
                },
                MXN: {
                    prefixes: ["MXN", "Mgex\\$", "\\$"],
                    suffixes: ["MXN", "Mex\\$", "\\$", "(?:Mexic(?:o|an)\\s)?peso[s]?"],
                    magnitudes: ["centavo", "cent[s]?"]
                },
                BRL: {
                    prefixes: ["BRL", "R\\$"],
                    suffixes: ["BRL", "Real(?:es)?", "R\\$", "(?:Brazil(?:ian)?\\s)?real(?:es)?"],
                    magnitudes: ["centavo", "cent[s]?"]
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
                million: 1000000,
                crore: 10000000,
                billion: 1000000000,
                trillion: 1000000000000
            },
            magnitudeAbbreviations: {
                mil: "million",
                bil: "billion",
                tril: "trillion"
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
            },
            metadata: {},
            filters: []
            // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
        }, overrides);

        Object.defineProperties(this, {
            supportedCurrencies: {
                get: function () {
                    var validCurrencies = Object.keys(this.currencies).filter(function (currency) {
                        return this.currencies[currency].prefixes.length && this.currencies[currency].suffixes.length && this.currencies[currency].value !== void 0;
                    }, this);
                    if (validCurrencies.length) {
                        return validCurrencies;
                    }
                    throw new Error("no valid currencies detected!");
                }
            },
            prefixes: {
                get: function () {
                    return this.currencies[this["default"]].prefixes;
                },
                set: function (prefixes) {
                    if (prefixes instanceof Array) {
                        this.currencies[this["default"]].prefixes = prefixes;
                    } else {
                        throw new Error("prefixes must be expressed as an array of strings");
                    }
                }
            },
            suffixes: {
                get: function () {
                    return this.currencies[this["default"]].suffixes;
                },
                set: function (suffixes) {
                    if (suffixes instanceof Array) {
                        this.currencies[this["default"]].suffixes = suffixes;
                    } else {
                        throw new Error("suffixes must be expressed as an array of strings");
                    }
                }
            },
            specialMagnitudes: {
                get: function () {
                    return this.currencies[this["default"]].magnitudes;
                }
            },
            magnitudeStrings: {
                get: function () {
                    return Object.keys(this.magnitudes).concat(Object.keys(this.magnitudeAbbreviations));
                }
            },
            numberStrings: {
                get: function () {
                    return Object.keys(this.numberWords);
                }
            },
            cache: {
                get: function () {
                    return this.metadata;
                },
                set: function (arr) {
                    var guid = arr[0],
                        hash = arr[1];

                    hash.id = guid;
                    this.metadata[guid] = hash;
                    if (isDom) {
                        Object.observe(this.metadata[guid], function (obj) {
                            obj = obj[0].object;
                            $("#" + obj.id).html("" + obj.currency + " " + obj.exactValue);
                        });
                    }
                }
            }
        });

        return this;
    }
});