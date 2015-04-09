define(["exports", "module", "polyfills"], function (exports, module, _polyfills) {
    "use strict";

    module.exports = Settings;
    function Settings(overrides, isDom) {
        Object.assign(this, {
            // this tells the regex engine what currency to look for when tagging a string/DOM node.
            supported: ["USD"],
            // hash of all supported currencies.  Add or change these values at will.
            currencies: {
                // these areg the standard abbrevations for these currencies.  If you are
                // adding currencies, it is highly recommended to use standard abbreviations.
                USD: {
                    // in order for a money string to pass the regex engine and filters,
                    // it must contain one of these prefixes or suffixes.
                    // new RegExp() will be called on these strings, so feel free to
                    // use your awesome regex skills and don't forget to escape
                    // special characters.
                    prefixes: ["USD", "\\$"],
                    suffixes: ["USD", "\\$", "buck[s]?", "(?:(?:US[A]?|American)\\s)?dollar[s]?"],
                    // some multipliers imply a certain currency and also change the value.
                    // list those, as well.
                    magnitudes: ["cent[s]?"]
                },
                GBP: {
                    prefixes: ["GBP", "£"],
                    suffixes: ["GBP", "£", "quid", "(?:English\\s)?pound[s]?"],
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
                    suffixes: ["CNY", "yuan", "¥", "(?:Chin(?:a|ese)\\s)?(?:renminbi|yuan)"]
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
                    prefixes: ["INR", "Rs\\.*?"],
                    suffixes: ["INR", "Rs\\.*?", "(?:India(?:n)\\s)?rupee[s]?"],
                    magnitudes: ["paise", "lakh", "crore"]
                },
                MXN: {
                    prefixes: ["MXN", "Mex\\$", "\\$"],
                    suffixes: ["MXN", "Mex\\$", "\\$", "(?:Mexic(?:o|an)\\s)?peso[s]?"],
                    magnitudes: ["centavo[s]?", "cent[s]?"]
                },
                BRL: {
                    prefixes: ["BRL", "R\\$"],
                    suffixes: ["BRL", "Real(?:es)?", "R\\$", "(?:Bra[zs]il(?:ian)?\\s)?real(?:es)?"],
                    magnitudes: ["centavo[s]?", "cent[s]?"]
                }
            },
            // should be self explanatory.
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
            // hash of abbreviations for magnitudes
            magnitudeAbbreviations: {
                mil: "million",
                bil: "billion",
                tril: "trillion"
            },
            // hash of values indexed to their English equivalents
            numberWords: {
                "a\\s": 1,
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
            // array of functions added with the addFilters method.  You can pass these
            // in as a setting as well.
            filters: []
        }, overrides);

        Object.defineProperties(this, {
            supportedCurrencies: {
                get: function () {
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
                get: function () {
                    var _this = this;

                    var prefixes = [];
                    this.supported.forEach((function (currency) {
                        prefixes = prefixes.concat(_this.currencies[currency].prefixes || []);
                    }).bind(this));
                    return prefixes;
                }
            },
            suffixes: {
                get: function () {
                    var _this = this;

                    var suffixes = [];
                    this.supported.forEach((function (currency) {
                        suffixes = suffixes.concat(_this.currencies[currency].suffixes || []);
                    }).bind(this));
                    return suffixes;
                }
            },
            specialMagnitudes: {
                get: function () {
                    var _this = this;

                    var magnitudes = [];
                    this.supported.forEach((function (currency) {
                        magnitudes = magnitudes.concat(_this.currencies[currency].magnitudes || []);
                    }).bind(this));
                    return magnitudes;
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