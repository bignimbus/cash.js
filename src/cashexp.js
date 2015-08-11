function CashExp (str, register) {
    this.raw = str;
    this.register = register;
    return this;
}

Object.assign(CashExp.prototype, {
    "generateGuid": function () {
        // returns a string of 8 consecutive alphanumerics
        return (Math.random() + 1).toString(36).substring(7);
    },
    "formHash": function (figure) {
        let currency = this.constructor.inferCurrency.call(this, figure),
            parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return this.register.numberWords[num] || 1;
            },
            nums = figure.match(new RegExp('(?:\\d|'
                + this.register.numberStrings.join('|')
                + '|\\.|,)+', 'gi'))[0],
            multipliers = new RegExp('(?:' + this.register.magnitudeStrings.join('|')
                + ')+', 'gi'),
            hash = {
                "currency": currency.code,
                "rate": this.register.currencies[currency.code].value || 1,
                "str": figure,
                "prefix": currency.index < figure.indexOf(nums),
                "coefficient": parseNums(nums.replace(',', '').trim()),
                "magnitude": (figure.match(multipliers) || []).map((mul) => {
                    mul = mul.trim();
                    if (this.register.magnitudeAbbreviations[mul]) {
                        mul = this.register.magnitudeAbbreviations[mul];
                    }
                    return this.register.magnitudes[mul] || 1;
                }),
            };
            hash.exactValue = () => {
                let val = hash.coefficient * hash.rate;
                hash.magnitude.forEach((factor) => {val *= factor});
                return val;
            }();

            return hash;
    },
    "inferCurrency": function (figure) {
        let match,
            regex,
            found,
            currencies = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes);
        currencies = `(?:${currencies.join('|')})`;
        regex = new RegExp(currencies, 'i');
        match = figure.match(regex)[0];
        this.register.supported.forEach((currency) => {
            let current = this.register.currencies[currency],
                symbols = [].concat(current.prefixes, current.suffixes, current.magnitudes || []);
                symbols = new RegExp(`(?:${symbols.join('|')})`, 'i');
            if (symbols.test(match)) {
                found = currency;
                index = figure.indexOf(match);
            }
        });
        return {
            "code": found,
            "index": figure.indexOf(match)
        };
    },
    "isValid": function (figure) {
        let currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes),
            hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'),
            isValidStr = hasCurrencySpec.test(figure)
                && this.register.filters.every(function (filter) {
                    return filter(figure);
                });
        return isValidStr;
    },
    "buildRegex": function (keywords) {
        let magnitudes = keywords.magnitudeStrings.join('|'),
            prefixes = keywords.prefixes.join('|'),
            suffixes = [].concat(keywords.suffixes, keywords.specialMagnitudes).join('|'),
            numberStr = keywords.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+'
                + '[\\.\\b\\s]?'
                + ')?'
                + '((\\d|' + numberStr + ')+(?:\\.|,)?)'
                + '+\\s?'
                + '(?:(?:' + magnitudes + ')\\s?)*'
                + '(?:(?:' + suffixes + ')\\s?)*',
            regex = new RegExp(regexStr, 'ig');
        return regex;
    }
});

export default CashExp;
