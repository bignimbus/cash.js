import Cash from 'cash-main';

export default class CashDom extends Cash {
    constructor (options) {
        super(options, true);
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
    }

    setCurrency (currency) {
        if (this.register.supportedCurrencies.indexOf(currency) === -1) {
            throw new Error('currency not supported.');
        }
        this.register.current = currency;
        this.constructor.exchange.call(this, currency);
    }

    update () {
        this.constructor.exchange.call(this);
    }

    static exchange (currency) {
        currency = currency || this.register.current;
        let obj,
            rate,
            cache = this.register.metadata

        for (id in cache) {
            obj = {};
            rate = this.register.currencies[currency].value;
            Object.assign(cache[id], {
                "currency": currency,
                "rate": rate,
                "exactValue": cache[id].exactValue * rate
            });
        }
    }
}
