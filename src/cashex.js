function format (obj, opts) {
    'use strict';
    let cents = opts.round ? 0 : 2
    return obj.exactValue.toLocaleString(opts.locale, {
        "minimumFractionDigits": cents,
        "maximumFractionDigits": cents,
        "useGrouping": opts.useGrouping
    });
}

export default class CashEx {
    constructor (str, register) {
        this.raw = str;
        this.register = register;
        this.guid = (Math.random() + 1).toString(36).substring(7);
        this.analyze(this.raw);
        if (this.register.isDom) {
            Object.observe(this, this.updateDom.bind(this));
        }
    }

    analyze (figure) {
        let currency = this.inferCurrency(figure),
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
                "prefixed": currency.index < figure.indexOf(nums),
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

        Object.assign(this, hash);
    }

    inferCurrency (figure) {
        let index,
            match,
            regex,
            found,
            candidate,
            currentCandidate,
            currencies = [].concat(this.register.prefixes, this.register.suffixes, this.register.specialMagnitudes);
        currencies = `(?:${currencies.join('|')})`;
        regex = new RegExp(currencies, 'i');
        match = figure.match(regex)[0];
        this.register.supported.forEach((currency) => {
            let current = this.register.currencies[currency],
                symbols = [].concat(current.prefixes, current.suffixes, current.magnitudes || []);
                symbols = new RegExp(`(?:${symbols.join('|')})`, 'i'),
            candidate = match.match(symbols);
            candidate = candidate ? candidate[0] : candidate;
            if (candidate) {
                if (currentCandidate) {
                    found = candidate.length > currentCandidate.length ? currency : found;
                } else {
                    found = currency;
                }
                currentCandidate = candidate;
                index = figure.indexOf(match);
            }
        });
        return {
            "code": found,
            "index": index
        };
    }

    recalculate (currency) {
        let oldRate = currency ? this.register.currencies[this.currency].value : 1,
            current = currency || this.currency,
            rate = this.register.currencies[current].value,
            multiplier = 1 / oldRate;
        Object.assign(this, {
            "currency": current,
            "rate": rate,
            "exactValue": this.exactValue * multiplier * rate
        });
    }

    updateDom (obj) {
        obj = obj[0].object;
        let display = format(obj, this.register.formatting);
        $(`#${obj.guid}`).html(`${obj.currency} ${display}`);
    }
}
