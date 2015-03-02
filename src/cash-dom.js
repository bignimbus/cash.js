import MoneyFinder from 'money-finder';
import Cash from 'cash-main';

export default class CashDom extends Cash {
    constructor (options) {
        super(options);
    }

    grab (nodes) {
        nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
        for (let node of nodes) {
            $(node).each((i, el) => {
                this.wrap($(el));
            });
        }
    }

    wrap ($el) {
        let html = $el.html();
        $el.html(this.addTags(html));
    }
}
