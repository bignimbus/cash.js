export default class CashEx {
    constructor (str, register) {
        this.raw = str;
        this.data = {};
        this.register = register;
        this.guid = (Math.random() + 1).toString(36).substring(7);
        this.analyze();
    }

    analyze () {
        let currency = this.inferCurrency(this.raw),
            parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return this.register.numberWords[num] || 1;
            },
            nums = this.raw.match(new RegExp('(?:\\d|'
                + this.register.numberStrings.join('|')
                + '|\\.|,)+', 'gi'))[0],
            multipliers = new RegExp('(?:' + this.register.magnitudeStrings.join('|')
                + ')+', 'gi');

        Object.assign(this, {
            "currency": currency.code,
            "rate": this.register.currencies[currency.code].value || 1,
            "str": this.raw,
            "prefixed": currency.index < this.raw.indexOf(nums),
            "coefficient": parseNums(nums.replace(',', '').trim()),
            "magnitude": (this.raw.match(multipliers) || []).map((mul) => {
                mul = mul.trim();
                if (this.register.magnitudeAbbreviations[mul]) {
                    mul = this.register.magnitudeAbbreviations[mul];
                }
                return this.register.magnitudes[mul] || 1;
            }),
        });

        this.exactValue = (() => {
            let val = this.coefficient;
            this.magnitude.forEach((factor) => {val *= factor});
            return val;
        })();

        this.voice = this.inferVoice();
    }

    inferVoice () {
        let obj = this.register.currencies[this.currency],
            choices = this.prefixed ? obj.prefixes : obj.suffixes;

        for (let i in choices) {
            let str = `(?:${choices[i].join('|')})`,
                regex = new RegExp(str, 'i');

            if (regex.test(this.raw)) {
                return i;
            }
        }
        if (!this.prefixed) {
            let str = obj.magnitudes.join('|'),
                regex = new RegExp(str, 'i');

            if (regex.test(this.raw)) {
                return 'conversational';
            }
        }
        return 'formal';
    }

    inferCurrency () {
        let index,
            match,
            regex,
            found,
            candidate,
            currentCandidate,
            currencies = [].concat(this.register.getPrefixes(), this.register.getSuffixes(), this.register.specialMagnitudes);
        currencies = `(?:${currencies.join('|')})`;
        regex = new RegExp(currencies, 'i');
        match = this.raw.match(regex)[0];
        this.register.supported.forEach((currency) => {
            let candidate,
                current = this.register.currencies[currency],
                symbols = [].concat(this.register.getPrefixes(currency), this.register.getSuffixes(currency), current.magnitudes || []);
            symbols = new RegExp(`(?:${symbols.join('|')})`, 'i');
            candidate = match.match(symbols);
            candidate = candidate ? candidate[0] : candidate;
            if (candidate) {
                if (currentCandidate) {
                    found = candidate.length > currentCandidate.length ? currency : found;
                } else {
                    found = currency;
                }
                currentCandidate = candidate;
                candidate = null;
                index = this.raw.indexOf(match);
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
        if (this.register.isDom) {
          this.updateDom();
        }
    }

    updateDom (obj) {
        let obj = this.register.currencies[this.currency].translations,
            str = obj[this.voice] || this.currency,
            order = [this.format(), str];
        if (this.prefixed) {
            order.reverse();
        }
        str = order.join(this.voice === 'symbolic' ? '' : ' ').replace(/\\/g, '');
        $(`#${this.guid}`).html(str);
    }

    format () {
        'use strict';
        let cents = this.register.formatting.round ? 0 : 2
        return this.exactValue.toLocaleString(this.register.formatting.locale, {
            "minimumFractionDigits": cents,
            "maximumFractionDigits": cents,
            "useGrouping": this.register.formatting.useGrouping
        });
    }
}
