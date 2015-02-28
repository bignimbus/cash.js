export default function setOptions (overrides) {
    return $.extend(true, {}, {
        "currencies": {
            "USD": "USD",
            "\\$": "USD",
            "bucks": "USD",
            "dollars": "USD"
        },
        "magnitudes": {
            "cents": 1e-2,
            "hundred": 1e2,
            "thousand": 1e3,
            "grand": 1e3,
            "lakh": 1e5,
            "mil": 1e6,
            "million": 1e6,
            "crore": 1e7,
            "bil": 1e9,
            "billion": 1e9,
            "tril": 1e12,
            "trillion": 1e12
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
        },
        // "mustHaveCurrencyCode": false, // TODO IMPLEMENT THIS
    }, overrides);
}
