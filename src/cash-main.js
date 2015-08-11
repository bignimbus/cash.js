import Register from 'register';
import CashExp from 'cashexp';

export default class Cash {
    constructor (options, isDom) {
        options = options || {};
        this.register = new Register(options || {}, isDom || false);
    }

    lookFor (...currencies) {
        this.register.supported = currencies;
        return this;
    }

    // TODO actually implement cashex
    tag (html) {
        let moneyStrings = this.constructor.buildRegex(this.register),
            wrapped = html.replace(moneyStrings, (figure) => {
                let trimmed = figure.trim();
                if (this.constructor.isValid.call(this, trimmed)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash.call(this, trimmed);
                    this.register.cache = [guid, hash];
                    figure = ` <span id="${guid}" class="cash-node">${trimmed}</span> `;
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
}
