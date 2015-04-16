import 'polyfills';
import currencies from 'currencies';

export default function Register (overrides, isDom) {
    Object.assign(this, currencies(), overrides);

    Object.defineProperties(this, {
        "supportedCurrencies": {
            "get": function () {
                let validCurrencies = Object.keys(this.currencies).filter((currency) => {
                    return this.currencies[currency].prefixes.length
                        && this.currencies[currency].suffixes.length
                        && this.currencies[currency].value !== void 0;
                });
                if (validCurrencies.length) {
                    return validCurrencies;
                }
                throw new Error('no valid currencies detected!');
            }
        },
        "prefixes": {
            "get": function () {
                let prefixes = [];
                this.supported.forEach((currency) => {
                    prefixes = prefixes.concat(this.currencies[currency].prefixes || []);
                }.bind(this));
                return prefixes;
            }
        },
        "suffixes": {
            "get": function () {
                let suffixes = [];
                this.supported.forEach((currency) => {
                    suffixes = suffixes.concat(this.currencies[currency].suffixes || []);
                }.bind(this));
                return suffixes;
            }
        },
        "specialMagnitudes": {
            "get": function () {
                let magnitudes = [];
                this.supported.forEach((currency) => {
                    magnitudes = magnitudes.concat(this.currencies[currency].magnitudes || []);
                }.bind(this));
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
            "set": function (arr) {
                let guid = arr[0],
                    hash = arr[1];
                
                hash.id = guid;
                this.metadata[guid] = hash;
                if (isDom) {
                    Object.observe(this.metadata[guid], (obj) => {
                        obj = obj[0].object;
                        let display = obj.exactValue.toFixed(2);
                        $(`#${obj.id}`).html(`${obj.currency} ${display}`);
                    });
                }
            }
        }
    });

    return this;
}
