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
what is needed?
second, a way for the user to manage the current currency on display. need
to know whether storing the current currency in the cache register is necessary.
My instinct is that it is not necessary, since we will keep the dom updated with
every change in currency.  There should be no cash nodes in memory that differ
from the current currency.
The update algorithm is key. We should engineer a generator method that spaces
everything out over an interval to preclude performance issues with multiple dom
lookups and computation.
    */

    update () {
        for (let [id, data] of this.register.cache) {

        }
    }
}
