import Settings from 'settings';

export default class Cash {
    constructor (options) {
        options = options || {};
        this.settings = new Settings(options.overrides || {});
    }

    addTags (html) {
        let moneyStrings = this.constructor.buildRegex(this.settings),
            wrapped = html.replace(moneyStrings, (figure) => {
                figure = figure.trim();
                if (this.constructor.isValid(figure)) {
                    let guid = this.constructor.generateGuid(),
                        hash = this.constructor.formHash(figure, this.settings);
                    this.settings.register = this.constructor.cache(guid, hash);
                    figure = ' ' + ('<span id="' + guid + '" class="cash-node">' + figure + '</span>').trim() + ' ';
                }
                return figure;
            });
        return wrapped;
    }

    static generateGuid () {
        // returns a string of 8 consecutive alphanumerics
        return (Math.random() + 1).toString(36).substring(7);
    }

    static formHash (figure, settings) {
        let parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return settings.numberWords[num] || -1;
            },
            nums = new RegExp('(?:\\d|'
                + settings.numberStrings.join('|')
                + '|\\.|,)+', 'gi'),
            multipliers = new RegExp('(?:' + settings.magnitudeStrings.join('|')
                + ')+', 'gi');

        return {
            "str": figure,
            "coefficient": parseNums(figure.match(nums)[0].replace(',', '').trim()),
            "magnitude": (figure.match(multipliers) || []).map((mul) => {
                mul = mul.trim();
                if (settings.magnitudeAbbreviations[mul]) {
                    mul = settings.magnitudeAbbreviations[mul];
                }
                return settings.magnitudes[mul] || 1;
            })
        };
    }

    static cache (guid, hash) {
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
        // return this.settings.filters.every((filter) => {
        //     return filter(figure);
        // });
    }

    static buildRegex (settings) {
        let magnitudes = settings.magnitudeStrings.join('|'),
            prefixes = settings.prefixes.join('|'),
            suffixes = settings.suffixes.join('|'),
            numberStr = settings.numberStrings.join('|'),
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
