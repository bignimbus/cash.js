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
                if (this.constructor.isValid(figure)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash(figure, this.register);
                    this.register.cache = this.constructor.compute(guid, hash);
                    figure = ` <span id="${guid}" class="cash-node">${figure}</span> `;
                }
                return figure;
            });
        return wrapped;
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

    static compute (guid, hash) {
        let obj = {};
        hash.exactValue = () => {
            let val = hash.coefficient;
            hash.magnitude.forEach((factor) => {val *= factor;});
            return val;
        }();
        obj[guid] = hash;
        return obj;
    }

    static isValid (figure) {
        return figure.length > 1 && /\D/.test(figure);
        // when filter support is implemented...
        // return this.register.filters.every((filter) => {
        //     return filter(figure);
        // });
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
