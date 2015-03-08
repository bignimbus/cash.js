import Settings from 'settings';

export default class Cash {
    constructor (options) {
        options = options || {};
        this.register = new Settings(options.overrides || {});
    }

    tag (html) {
        let moneyStrings = this.constructor.buildRegex(this.register),
            wrapped = html.replace(moneyStrings, (figure) => {
                figure = figure.trim();
                if (this.constructor.isValid(figure, this.register)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash(figure, this.register);
                    this.register.cache = [guid, this.constructor.computeExactValue(hash)];
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
    }

    exchange (hash) {
        // always make the default currency worth 1
        if (!(hash instanceof Object)) {
            throw new Error('exchange rates must be passed as an object, e.g.{"USD": 1, "EUR": 0.92}');
            return;
        }
        for (let currency in hash) {
            let value = +hash[currency];
            if (!isNaN(value)) {
                this.register.currencies[currency].value = value;
            }
        }
    }

    static generateGuid () {
        // returns a string of 8 consecutive alphanumerics
        return (Math.random() + 1).toString(36).substring(7);
    }

    static formHash (figure, keywords) {
        let parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return keywords.numberWords[num] || -1;
            },
            nums = new RegExp('(?:\\d|'
                + keywords.numberStrings.join('|')
                + '|\\.|,)+', 'gi'),
            multipliers = new RegExp('(?:' + keywords.magnitudeStrings.join('|')
                + ')+', 'gi');

        return {
            "currency": keywords.current,
            "str": figure,
            "coefficient": parseNums(figure.match(nums)[0].replace(',', '').trim()),
            "magnitude": (figure.match(multipliers) || []).map((mul) => {
                mul = mul.trim();
                if (keywords.magnitudeAbbreviations[mul]) {
                    mul = keywords.magnitudeAbbreviations[mul];
                }
                return keywords.magnitudes[mul] || 1;
            })
        };
    }

    static computeExactValue (hash) {
        hash.exactValue = () => {
            let val = hash.coefficient;
            hash.magnitude.forEach((factor) => {val *= factor;});
            return val;
        }();
        return hash;
    }

    static isValid (figure, register) {
        let currencyStr = [].concat(register.prefixes, register.suffixes, register.specialMagnitudes),
            hasCurrencySpec = new RegExp(`(?:${currencyStr.join(')|(?:')})`, 'i'),
            isValidStr = hasCurrencySpec.test(figure)
                && register.filters.every(function (filter) {
                    return filter(figure);
                });
        return isValidStr;
    }

    static buildRegex (keywords) {
        let magnitudes = keywords.magnitudeStrings.join('|'),
            prefixes = keywords.prefixes.join('|'),
            suffixes = keywords.suffixes.join('|'),
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
