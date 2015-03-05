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
                    var guid = this.register(figure);
                    figure = ' ' + ('<span id="' + guid + '" class="cash-node">' + figure + '</span>').trim() + ' ';
                }
                return figure;
            });
        return wrapped;
    }

    register (figure) {
        let parseNums = (num) => {
                if (!isNaN(+num)) {
                    return +num;
                }
                return this.settings.numberWords[num] || -1;
            },
        // returns a string of 8 consecutive alphanumerics
            guid = (Math.random() + 1).toString(36).substring(7),
            nums = new RegExp('(?:\\d|'
                + this.settings.numberStrings.join('|')
                + '|\\.|,)+', 'gi'),
            multipliers = new RegExp('(?:' + this.settings.magnitudeStrings.join('|')
                + ')+', 'gi');
        this.cache(guid, {
            "str": figure,
            "coefficient": parseNums(figure.match(nums)[0].replace(',', '').trim()),
            "magnitude": (figure.match(multipliers) || []).map((mul) => {
                mul = mul.trim();
                if (this.settings.magnitudeAbbreviations[mul]) {
                    mul = this.settings.magnitudeAbbreviations[mul];
                }
                return this.settings.magnitudes[mul] || 1;
            })
        });
        return guid;
    }

    cache (guid, hash) {
        let obj = {};
        hash.exactValue = () => {
            let val = hash.coefficient;
            hash.magnitude.forEach((factor) => {val *= factor;});
            return val;
        }();
        obj[guid] = hash;
        this.settings.register = obj;
    }

    static isValid (figure) {
        return figure.length > 1 && /\D/.test(figure);
        // when filter support is implemented...
        // return this.settings.filters.every((filter) => {
        //     return filter(figure);
        // });
    }

    static buildRegex (settings) {
        // TODO: use getters and setters
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
