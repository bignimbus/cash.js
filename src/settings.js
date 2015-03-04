export default function Settings (overrides) {
    $.extend(true, this, {
        "default": "USD",
        "supportedCurrencies": [],
        "currencies": {
            "USD": {
                "prefixes": ["USD", "\\$"],
                "suffixes": ["USD", "\\$", "bucks", "(?:(?:US[A]?|American)\\s)?dollar[s]?"]
            },
            "GBP": {
                "prefixes": ["GBP", "£"],
                "suffixes": ["GBP", "£", "quid", "pound[s]?"]
            },
            "EUR": {
                "prefixes": ["EUR", "€"],
                "suffixes": ["EUR", "€", "euro[s]?"]
            },
            "JPY": {
                "prefixes": ["JPY", "¥"],
                "suffixes": ["JPY", "¥", "(?:Japan(?:ese)?\\s)?yen"]
            },
            "CNY": {
                "prefixes": ["CNY", "yuan", "¥"],
                "suffixes": ["CNY", "yuan", "¥", "(?:Chin(?:a|ese)\\s)?renminbi"]
            },
            "RUB": {
                "prefixes": ["RUB", "руб"],
                "suffixes": ["RUB", "руб", "(?:Russia[n]?\\s)?ruble[s]?"]
            },
            "CAD": {
                "prefixes": ["CAD", "\\$"],
                "suffixes": ["CAD", "\\$", "buck[s]?", "(?:Canad(?:a|ian)\\s)?dollar[s]?"]
            },
            "AUD": {
                "prefixes": ["AUD", "\\$"],
                "suffixes": ["AUD", "\\$", "buck[s]?", "(?:Australia[n]?\\s)?dollar[s]?"]
            },
            "INR": {
                "prefixes": ["INR", "Rs\\.?"],
                "suffixes": ["INR", "Rs\\.?", "(?:India(?:n)\\s)?rupee[s]?"]
            }
        },
        "magnitudes": {
            "pence": 1e-2,
            "paise": 1e-2,
            "cents": 1e-2,
            "hundred": 1e2,
            "thousand": 1e3,
            "grand": 1e3,
            "lakh": 1e5,
            "mil(?:lion)?": 1e6,
            "crore": 1e7,
            "bil(?:lion)?": 1e9,
            "tril(?:lion)?": 1e12
        },
        "numberWords": {
            "a": 1,
            "one": 1,
            "two": 2,
            "three": 3,
            "four": 4,
            "five": 5,
            "six": 6,
            "seven": 7,
            "eight": 8,
            "nine": 9,
            "ten": 10,
            "eleven": 11,
            "twelve": 12,
            "thirteen": 13,
            "fourteen": 14,
            "fifteen": 15,
            "sixteen": 16
        }
        // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
    }, overrides);

    Object.defineProperties(this, {
        "supportedCurrencies": {
            "get": function () {
                return this.supportedCurrencies.concat(this.default);
            },
            "set": (currencies) => {
                if (currencies instanceof Array) {
                    this.supportedCurrencies = currencies.filter(function (currency) {
                        return currency !== this.default;
                    }, this);
                } else {
                    throw new Error('currencies must be expressed as an array of strings');
                }
            }
        },
        "prefixes": {
            "get": function () {
                return this.currencies[this.default].prefixes;
            },
            "set": function (prefixes) {
                if (prefixes instanceof Array) {
                    this.currencies[this.default].prefixes = prefixes;
                } else {
                    throw new Error('prefixes must be expressed as an array of strings');
                }
            }
        },
        "suffixes": {
            "get": function () {
                return this.currencies[this.default].suffixes;
            },
            "set": function (suffixes) {
                if (suffixes instanceof Array) {
                    this.currencies[this.default].suffixes = suffixes;
                } else {
                    throw new Error('prefixes must be expressed as an array of strings');
                }
            }
        },
        "magnitudeStrings": {
            "get": function () {
                return Object.keys(this.magnitudes);
            }
        },
        "numberStrings": {
            "get": function () {
                return Object.keys(this.numberWords);
            }
        }
    });

    return this;
}
