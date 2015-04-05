import Settings from 'settings';

export default class Cash {
    constructor (options, isDom) {
        options = options || {};
        this.register = new Settings(options.overrides || {}, isDom || false);
    }

    tag (html) {
        let moneyStrings = this.constructor.buildRegex(this.register),
            wrapped = html.replace(moneyStrings, (figure) => {
                figure = figure.trim();
                if (this.constructor.isValid(figure, this.register)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash(figure, this.register);
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
        // always make the default currency worth 1
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

    static formHash (figure, register) {
        let parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return register.numberWords[num] || -1;
            },
            nums = new RegExp('(?:\\d|'
                + register.numberStrings.join('|')
                + '|\\.|,)+', 'gi'),
            multipliers = new RegExp('(?:' + register.magnitudeStrings.join('|')
                + ')+', 'gi'),
            hash = {
                "currency": register.current,
                "rate": register.currencies[register.current].value || 1,
                "str": figure,
                "coefficient": parseNums(figure.match(nums)[0].replace(',', '').trim()),
                "magnitude": (figure.match(multipliers) || []).map((mul) => {
                    mul = mul.trim();
                    if (register.magnitudeAbbreviations[mul]) {
                        mul = register.magnitudeAbbreviations[mul];
                    }
                    return register.magnitudes[mul] || 1;
                }),
            };
            hash.exactValue = () => {
                let val = hash.coefficient * hash.rate;
                hash.magnitude.forEach((factor) => {val *= factor});
                return val;
            }();

            return hash;
    }

    static isValid (figure, register) {
        let currencyStr = [].concat(register.prefixes, register.suffixes, register.specialMagnitudes),
            hasCurrencySpec = new RegExp('(?:' + currencyStr.join('|') + ')', 'i'),
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
