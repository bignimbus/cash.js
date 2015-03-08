import Cash from 'cash-main';

export default class CashDom extends Cash {
    constructor (options) {
        super(options);
    }

    wrap (nodes) {
        nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
        for (let node of nodes) {
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

/*
exchangeRates -> populates the register with exchange rates
    useful for devs who do not have backend filling these things in on pageload
    ajax requests
    useful for devs using multiple api's, perhaps for the case of bitcoin, dogecoin,
    or some random valuation (diamond cleans, stock price)
    everything depends on the default currency, all operations go through this
update -> redraws the cash nodes in the dom
    dying to write a generator function called on an interval for this.
    should probably configure it to run in realtime if dev desires.
    use Object.observe on register - bind to the dom element!
setCurrency -> sets register.current; triggers update?
    
*/

    update () {

    }
}
