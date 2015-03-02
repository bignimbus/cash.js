define(["exports", "module"], function (exports, module) {
    "use strict";

    module.exports = buildRegex;
    function buildRegex(settings) {
        var magnitudes = Object.keys(settings.magnitudes).join("|"),
            currencyStr = Object.keys(settings.currencies).join("|"),
            numberStr = Object.keys(settings.numberWords).join("|"),

        // work in progress; needs TLC:
        regexStr = "(?:(" + currencyStr + "){1,2}|(?:\\.|\\b|\\s){1})+" + "((\\d|" + numberStr + ")+(?:\\.|,){0,1})+\\s?" + "(?:" + magnitudes + ")*\\1{0,2}(?:\\s|\\b)+",
            regex = new RegExp(regexStr, "ig");
        console.log(regex);
        return regex;
    }
});