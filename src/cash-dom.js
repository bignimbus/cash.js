import Cash from 'cash-main';

export default class CashDom extends Cash {
    constructor (options) {
        options = options || {};
        super(options, true);
        this.register.metadata = {};
        if (options.metadata) {
            for (var id in options.metadata) {
                this.register.cache = options.metadata[id];
            }
        }
    }

    wrap (nodes) {
        nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
        for (let node in nodes) {
            node = nodes[node];
            $(node).each((i, el) => {
                let $el = $(el),
                    html = $el.html() || '';
                html = html.replace(/<span id="\w*?"\sclass="cash-node">([^<]*?)<\/span>/gi, (m, text) => text);
                if (html) {
                    $el.html(super.tag(html));
                }
            });
        }
        return this;
    }

    exchange (...currencies) {
        currencies.forEach((currency) => {
            if (this.register.supportedCurrencies.indexOf(currency) === -1) {
                throw new Error(`${currency} not supported.`);
            }
        });
        this.for = (targets, source) => {
            this.constructor.recalculate.call(this, source, targets);
        }.bind(this, currencies);
        return this;
    }

    update () {
        this.constructor.recalculate.call(this);
        return this;
    }

    static recalculate (source, targets) {
        let obj,
            rate,
            current,
            oldRate,
            multiplier,
            cache = this.register.metadata;

        for (id in cache) {
            if (targets && targets.indexOf(cache[id].currency) === -1) {
                continue;
            }
            obj = {};
            oldRate = source ? this.register.currencies[cache[id].currency].value : 1;
            current = source || cache[id].currency;
            rate = this.register.currencies[current].value;
            multiplier = 1 / oldRate;
            Object.assign(cache[id], {
                "currency": current,
                "rate": rate,
                "exactValue": cache[id].exactValue * multiplier * rate
            });
        }
        if (this.for) {
            this.for = null;
        }
    }
}
