import Register from 'register';

export default class Cash {
    constructor (options, isDom) {
        options = options || {};
        this.register = new Register(options.overrides || {}, isDom || false);
    }

    lookFor (...currencies) {
        this.register.supported = currencies;
        return this;
    }

    tag (html) {
        let moneyStrings = this.constructor.buildRegex(this.register),
            wrapped = html.replace(moneyStrings, (figure) => {
                let trimmed = figure.trim();
                if (this.constructor.isValid.call(this, trimmed)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash.call(this, trimmed);
                    this.register.cache = [guid, hash];
                    figure = ` <span id="${guid}" class="cash-node">${figure}</span> `;
                }
                return figure;
            });
        return wrapped;
    }

    addFilters () {
        let filters = Array.prototype.slice.call(arguments);
        filters = filters.filter(function (filter) {
            return typeof filter === "function";
        });
        this.register.filters = this.register.filters.concat(filters);
        return this;
    }

    setValues (hash) {
        if (!(hash instanceof Object)) {
            throw new Error('exchange rates must be passed as an object, e.g.{"USD": 1, "EUR": 0.92}');
        }
        for (let currency in hash) {
            let value = +hash[currency];
            if (!isNaN(value)) {
                this.register.currencies[currency].value = value;
            }
        }
        return this;
    }

    static generateGuid () {
        // returns a string of 8 consecutive alphanumerics
        return (Math.random() + 1).toString(36).substring(7);
    }

    static formHash (figure) {
        let currency = this.constructor.inferCurrency.call(this, figure),
            parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return this.register.numberWords[num] || 1;
            },
            nums = new RegExp('(?:\\d|'
                + this.register.numberStrings.join('|')
                + '|\\.|,)+', 'gi'),
            multipliers = new RegExp('(?:' + this.register.magnitudeStrings.join('|')
                + ')+', 'gi'),
            hash = {
                "currency": currency,
                "rate": this.register.currencies[currency].value || 1,
                "str": figure,
                "coefficient": parseNums(figure.match(nums)[0].replace(',', '').trim()),
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
    }

    static inferCurrency (figure) {
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
            }
        });
        return found;
    }

    static isValid (figure) {
        let currencyStr = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes),
            hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'),
            isValidStr = hasCurrencySpec.test(figure)
                && this.register.filters.every(function (filter) {
                    return filter(figure);
                });
        return isValidStr;
    }

    static buildRegex (keywords) {
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
}
