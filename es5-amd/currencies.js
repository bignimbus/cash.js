define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = function () {
        return {
            formatting: {
                locale: "en-US",
                useGroupings: true,
                round: false },
            // this tells the regex engine what currency to look for when tagging a string/DOM node.
            supported: ["USD"],
            // hash of all supported currencies.  Add or change these values at will.
            currencies: {
                // these are the standard abbrevations for these currencies.  If you are
                // adding currencies, it is highly recommended to use standard abbreviations.
                USD: {
                    // in order for a money string to pass the regex engine and filters,
                    // it must contain one of these prefixes or suffixes.
                    // new RegExp() will be called on these strings, so feel free to
                    // use your awesome regex skills and don't forget to escape
                    // special characters.
                    prefixes: {
                        formal: ["USD"],
                        symbolic: ["\\$"]
                    },
                    suffixes: {
                        formal: ["USD"],
                        symbolic: ["\\$"],
                        conversational: ["(?:(?:US[A]?|American)\\s)?dollar[s]?"],
                        casual: ["buck[s]?"]
                    },
                    // some multipliers imply a certain currency and also change the value.
                    // list those, as well.
                    magnitudes: ["cent[s]?"]
                },
                GBP: {
                    prefixes: {
                        formal: ["GBP"],
                        symbolic: ["£"]
                    },
                    suffixes: {
                        formal: ["GBP"],
                        symbolic: ["£"],
                        casual: ["quid"],
                        conversational: ["(?:English\\s)?pound[s]?"]
                    },
                    magnitudes: ["pence"]
                },
                EUR: {
                    prefixes: {
                        formal: ["EUR"],
                        symbolic: ["€"]
                    },
                    suffixes: {
                        formal: ["EUR"],
                        symbolic: ["€"],
                        conversational: ["euro[s]?"]
                    }
                },
                JPY: {
                    prefixes: {
                        formal: ["JPY"],
                        symbolic: ["¥"] },
                    suffixes: {
                        formal: ["JPY"],
                        symbolic: ["¥"],
                        conversational: ["(?:Japan(?:ese)?\\s)?yen"]
                    }
                },
                CNY: {
                    prefixes: {
                        formal: ["CNY"],
                        symbolic: ["¥"]
                    },
                    suffixes: {
                        formal: ["CNY"],
                        conversational: ["yuan", "(?:Chin(?:a|ese)\\s)?(?:renminbi|yuan)"],
                        symbolic: ["¥"]
                    }
                },
                RUB: {
                    prefixes: {
                        formal: ["RUB"],
                        symbolic: ["руб"]
                    },
                    suffixes: {
                        formal: ["RUB"],
                        symbolic: ["руб"],
                        conversational: ["(?:Russia[n]?\\s)?ruble[s]?"]
                    }
                },
                CAD: {
                    prefixes: {
                        formal: ["CAD"],
                        symbolic: ["\\$"]
                    },
                    suffixes: {
                        formal: ["CAD"],
                        symbolic: ["\\$"],
                        casual: ["buck[s]?"],
                        conversational: ["(?:Canad(?:a|ian)\\s)?dollar[s]?"]
                    },
                    magnitudes: ["cent[s]?"]
                },
                AUD: {
                    prefixes: {
                        formal: ["AUD"],
                        symbolic: ["\\$"]
                    },
                    suffixes: {
                        formal: ["AUD"],
                        symbolic: ["\\$"],
                        casual: ["buck[s]?"],
                        conversational: ["(?:Australia[n]?\\s)?dollar[s]?"]
                    },
                    magnitudes: ["cent[s]?"]
                },
                INR: {
                    prefixes: {
                        formal: ["INR"],
                        symbolic: ["Rs\\.*?"]
                    },
                    suffixes: {
                        formal: ["INR"],
                        symbolic: ["Rs\\.*?"],
                        conversational: ["(?:India(?:n)\\s)?rupee[s]?"]
                    },
                    magnitudes: ["paise", "lakh", "crore"]
                },
                MXN: {
                    prefixes: {
                        formal: ["MXN"],
                        symbolic: ["Mex\\$", "\\$"]
                    },
                    suffixes: {
                        formal: ["MXN"],
                        symbolic: ["Mex\\$", "\\$"],
                        conversational: ["(?:Mexic(?:o|an)\\s)?peso[s]?"]
                    },
                    magnitudes: ["centavo[s]?", "cent[s]?"]
                },
                BRL: {
                    prefixes: {
                        formal: ["BRL"],
                        symbolic: ["R\\$"]
                    },
                    suffixes: {
                        formal: ["BRL"],
                        conversational: ["(?:Bra[zs]il(?:ian)?\\s)?real(?:es)?"],
                        symbolic: ["R\\$"]
                    },
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
        };
    };
});