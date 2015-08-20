import 'polyfills';
import currencies from 'currencies';

export default class Register {
    constructor (overrides, isDom) {
        Object.assign(this, currencies(), overrides, {
            "isDom": isDom
        });
        Object.defineProperties(this, {
            "supportedCurrencies": {
                "get": function () {
                    let validCurrencies = Object.keys(this.currencies).filter((currency) => {
                        return Object.keys(this.currencies[currency].prefixes).length
                            && Object.keys(this.currencies[currency].suffixes).length
                            && this.currencies[currency].value !== void 0;
                    });
                    if (validCurrencies.length) {
                        return validCurrencies;
                    }
                    throw new Error('no valid currencies detected!');
                }
            },
            "specialMagnitudes": {
                "get": function () {
                    let magnitudes = [];
                    this.supported.forEach((currency) => {
                        magnitudes = magnitudes.concat(this.currencies[currency].magnitudes || []);
                    }, this);
                    return magnitudes;
                }
            },
            "magnitudeStrings": {
                "get": function () {
                    return Object.keys(this.magnitudes).concat(Object.keys(this.magnitudeAbbreviations));
                }
            },
            "numberStrings": {
                "get": function () {
                    return Object.keys(this.numberWords);
                }
            },
            "cache": {
                "get": function () {
                    return this.metadata;
                },
                "set": function (cashexp) {
                    let guid = cashexp.guid,
                        hash = cashexp;
                    
                    hash.guid = guid;
                    this.metadata[guid] = hash;
                }
            }
        });
    }

    getPrefixes (...currencies) {
        if (!currencies.length) {
            currencies = this.supported;
        }
        let prefixes = [];
        currencies.forEach((currency) => {
            if (!this.currencies[currency]) {
                return;
            }
            for (let i in this.currencies[currency].prefixes) {
                let thing = this.currencies[currency].prefixes[i];
                prefixes = [].concat(prefixes, thing || []);
            }
        });
        return prefixes;
    }

    getSuffixes (...currencies) {
        if (!currencies.length) {
            currencies = this.supported;
        }
        let suffixes = [];
        currencies.forEach((currency) => {
            if (!this.currencies[currency]) {
                return;
            }
            for (let i in this.currencies[currency].suffixes) {
                suffixes = suffixes.concat(this.currencies[currency].suffixes[i] || []);
            }
        });
        return suffixes;
    }
}
