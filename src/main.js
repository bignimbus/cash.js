import MoneyFinder from 'money-finder';
import CashStrap from 'cash-strap';
import buildRegex from 'regex-builder';

export default class Cash extends CashStrap {
    constructor (options) {
        super(options);
    }

    grab (nodes) {
        nodes = (typeof nodes === 'string' ? [nodes] : nodes) || [];
        for (let node of nodes) {
            console.log(node);
            $(node).each((i, el) => {
                this.wrap($(el));
            });
        }
    }

    wrap ($el) {
        let html = $el.html();
        $el.html(this.addTags(html));
    }

    addTags (html) {
        let moneyStrings = buildRegex(this.settings),
            wrapped = html.replace(moneyStrings,
                (figure) => ' ' + ('<span class="cash-node">' + figure.trim() + '</span>').trim() + ' ');
        return wrapped;
    }
}