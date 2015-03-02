import setOptions from 'defaults';
export default class CashStrap {
    constructor (options) {
        options = options || {};
        this.settings = options.overrides && !options.overrides.overwriteAll ?
            setOptions(options.overrides || {}) : options.overrides || setOptions({});

    }
}
