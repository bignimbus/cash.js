export default function buildRegex (settings) {
    var magnitudes = Object.keys(settings.magnitudes).join('|'),
        currencyStr = Object.keys(settings.currencies).join('|'),
        numberStr = Object.keys(settings.numberWords).join('|'),
        regexStr = '((' + currencyStr + '|\\.|\\b){1,3})\\s?'
            + '((\\d|' + numberStr + ')+[\\s\\.,]*)+'
            + '(' + magnitudes + ')*(' + currencyStr + '|\\s|\\b){1,3}',
        regex = new RegExp(regexStr, 'ig');
    return regex;
}
