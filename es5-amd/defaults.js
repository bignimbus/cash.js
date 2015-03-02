define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = setOptions;
    function setOptions(overrides) {
        return $.extend(true, {}, {
            currencies: {
                USD: "USD",
                "\\$": "USD",
                bucks: "USD",
                dollars: "USD"
            },
            magnitudes: {
                cents: 0.01,
                hundred: 100,
                thousand: 1000,
                grand: 1000,
                lakh: 100000,
                "mil(?:lion)": 1000000,
                crore: 10000000,
                "bil(?:lion)?": 1000000000,
                "tril(?:lion)": 1000000000000 },
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
            } }, overrides);
    }
});

// "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS