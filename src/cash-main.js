import Register from 'register';
import CashEx from 'cashex';

export default class Cash {
    constructor (options, isDom) {
        options = options || {};
        this.register = new Register(options || {}, isDom || false);
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
                    let cashex = new CashEx(trimmed, this.register);
                    this.register.cache = cashex;
                    figure = ` <span id="${cashex.guid}" class="cash-node">${trimmed}</span> `;
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

    setLocale (locale) {
        this.register.formatting.locale = locale;
        return this;
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
