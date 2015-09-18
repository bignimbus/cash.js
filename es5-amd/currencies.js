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
                        symbolic: ["\\$"],
                        formal: ["USD"]
                    },
                    suffixes: {
                        symbolic: ["\\$"],
                        conversational: ["(?:(?:US[A]?|American)\\s)?dollar[s]?"],
                        casual: ["buck[s]?", "bucks"],
                        formal: ["USD"]
                    },
                    // some multipliers imply a certain currency and also change the value.
                    // list those, as well.
                    magnitudes: ["cent[s]?"],
                    translations: {
                        casual: "bucks",
                        conversational: "dollars",
                        symbolic: "$"
                    }
                },
                GBP: {
                    prefixes: {
                        symbolic: ["£"],
                        formal: ["GBP"]
                    },
                    suffixes: {
                        symbolic: ["£"],
                        casual: ["quid"],
                        conversational: ["(?:English\\s)?pound[s]?"],
                        formal: ["GBP"]
                    },
                    magnitudes: ["pence"],
                    translations: {
                        casual: "quid",
                        conversational: "pounds",
                        symbolic: "£"
                    }
                },
                EUR: {
                    prefixes: {
                        symbolic: ["€"],
                        formal: ["EUR"]
                    },
                    suffixes: {
                        symbolic: ["€"],
                        conversational: ["euro[s]?"],
                        formal: ["EUR"]
                    },
                    translations: {
                        formal: "EUR",
                        conversational: "euro",
                        symbolic: "€"
                    }
                },
                JPY: {
                    prefixes: {
                        symbolic: ["¥"],
                        formal: ["JPY"]
                    },
                    suffixes: {
                        symbolic: ["¥"],
                        conversational: ["(?:Japan(?:ese)?\\s)?yen"],
                        formal: ["JPY"]
                    },
                    translations: {
                        conversational: "yen",
                        symbolic: "¥"
                    }
                },
                CNY: {
                    prefixes: {
                        symbolic: ["¥"],
                        formal: ["CNY"]
                    },
                    suffixes: {
                        conversational: ["yuan", "(?:Chin(?:a|ese)\\s)?(?:renminbi|yuan)"],
                        symbolic: ["¥"],
                        formal: ["CNY"]
                    },
                    translations: {
                        conversational: "yuan",
                        symbolic: "¥"
                    }
                },
                RUB: {
                    prefixes: {
                        symbolic: ["руб"],
                        formal: ["RUB"]
                    },
                    suffixes: {
                        symbolic: ["руб"],
                        conversational: ["(?:Russia[n]?\\s)?ruble[s]?"],
                        formal: ["RUB"]
                    },
                    translations: {
                        conversational: "rubles",
                        symbolic: "руб"
                    }
                },
                CAD: {
                    prefixes: {
                        symbolic: ["\\$"],
                        formal: ["CAD"]
                    },
                    suffixes: {
                        symbolic: ["\\$"],
                        casual: ["buck[s]?"],
                        conversational: ["(?:Canad(?:a|ian)\\s)?dollar[s]?"],
                        formal: ["CAD"]
                    },
                    magnitudes: ["cent[s]?", "cents"],
                    translations: {
                        symbolic: "$",
                        casual: "bucks",
                        conversational: "dollars"
                    }
                },
                AUD: {
                    prefixes: {
                        symbolic: ["\\$"],
                        formal: ["AUD"]
                    },
                    suffixes: {
                        symbolic: ["\\$"],
                        casual: ["buck[s]?", "bucks"],
                        conversational: ["(?:Australia[n]?\\s)?dollar[s]?"],
                        formal: ["AUD"]
                    },
                    magnitudes: ["cent[s]?"],
                    translations: {
                        casual: "bucks",
                        symbolic: "$",
                        conversational: "dollars"
                    }
                },
                INR: {
                    prefixes: {
                        symbolic: ["Rs\\.*?", "Rs\\."],
                        formal: ["INR"]
                    },
                    suffixes: {
                        symbolic: ["Rs\\.*?"],
                        conversational: ["(?:India(?:n)\\s)?rupee[s]?"],
                        formal: ["INR"]
                    },
                    magnitudes: ["paise", "lakh", "crore"],
                    translations: {
                        conversational: "rupees",
                        symbolic: "Rs"
                    }
                },
                MXN: {
                    prefixes: {
                        symbolic: ["\\$", "Mex\\$"],
                        formal: ["MXN"]
                    },
                    suffixes: {
                        symbolic: ["\\$", "Mex\\$"],
                        conversational: ["(?:Mexic(?:o|an)\\s)?peso[s]?"],
                        formal: ["MXN"]
                    },
                    magnitudes: ["centavo[s]?", "cent[s]?"],
                    translations: {
                        conversational: "pesos",
                        symbolic: "Mex$"
                    }
                },
                BRL: {
                    prefixes: {
                        symbolic: ["R\\$"],
                        formal: ["BRL"]
                    },
                    suffixes: {
                        conversational: ["(?:Bra[zs]il(?:ian)?\\s)?real(?:es)?"],
                        symbolic: ["R\\$"],
                        formal: ["BRL"]
                    },
                    magnitudes: ["centavo[s]?", "cent[s]?"],
                    translations: {
                        symbolic: "R$",
                        conversational: "reales"
                    }
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