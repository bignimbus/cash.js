export default class CashEx {
    constructor (str, register) {
        this.raw = str;
        this.register = register;
        this.guid = (Math.random() + 1).toString(36).substring(7);
        this.formHash(this.raw);
    }

    formHash (figure) {
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

        Object.assign(this, hash);
    }

    inferCurrency (figure) {
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
    }
}
