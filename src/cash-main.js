import Settings from 'settings';

export default class Cash {
    constructor (options) {
        options = options || {};
        this.settings = new Settings(options.overrides || {});
    }

    addTags (html) {
        let moneyStrings = this.constructor.buildRegex(this.settings),
            wrapped = html.replace(moneyStrings, (figure) => {
                if (this.constructor.isValid(figure)) {
                    figure = ' ' + ('<span class="cash-node">' + figure.trim() + '</span>').trim() + ' ';
                }
                return figure;
            });
        return wrapped;
    }

    static isValid (figure) {
        figure = figure.trim();
        return figure.length > 1 && /\D/.test(figure);
        // when filter support is implemented...
        return this.settings.filters.every((filter) => {
            return filter(figure);
        });
    }

    static buildRegex (settings) {
        // TODO: use getters and setters
        let magnitudes = settings.magnitudeStrings.join('|'),
            prefixes = settings.prefixes.join('|'),
            suffixes = settings.suffixes.join('|'),
            numberStr = settings.numberStrings.join('|'),
            // work in progress; needs TLC:
            regexStr = '(?:(?:(' + prefixes + ')\\s?)+[\\.\\b\\s]?)?'
                + '((\\d|' + numberStr + ')+(?:\\.|,)?)+\\s?'
                + '(?:(?:' + magnitudes + ')\\s?)*(?:(?:'
                + suffixes + ')\\s?)*',
            regex = new RegExp(regexStr, 'ig');
        return regex;
    }
}
