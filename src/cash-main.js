import setOptions from 'defaults';

export default class CashStrap {
    constructor (options) {
        options = options || {};
        this.settings = options.overrides && !options.overrides.overwriteAll ?
            setOptions(options.overrides || {}) : options.overrides || setOptions({});

    }

    addTags (html) {
        let moneyStrings = this.constructor.buildRegex(this.settings),
            wrapped = html.replace(moneyStrings, (figure) => {
                if (this.constructor.stringFilter(figure)) {
                    figure = ' ' + ('<span class="cash-node">' + figure.trim() + '</span>').trim() + ' ';
                }
                return figure;
            });
        return wrapped;
    }

    static stringFilter (figure) {
        figure = figure.trim();
        return figure.length > 1 && /\D/.test(figure);
        // when filter support is implemented...
        return this.settings.filters.every((filter) => {
            return filter(figure);
        });
    }

    static buildRegex (settings) {
        // TODO: use getters and setters
        let magnitudes = Object.keys(settings.magnitudes).join('|'),
            currencyStr = Object.keys(settings.currencies).join('|'),
            numberStr = Object.keys(settings.numberWords).join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + currencyStr + ')\\s?)+[\\.\\b\\s]?)?'
                + '((\\d|' + numberStr + ')+(?:\\.|,)?)+\\s?'
                + '(?:(?:' + magnitudes + ')\\s?)*(?:(?:'
                + currencyStr + ')\\s?)*',
            regex = new RegExp(regexStr, 'ig');
        return regex;
    }
}
