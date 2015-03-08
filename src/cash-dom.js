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
update -> redraws the cash nodes in the dom
    dying to write a generator function called on an interval for this.
    should probably configure it to run in realtime if dev desires.
    use Object.observe on register - bind to the dom element!
setCurrency -> sets register.current; triggers update?
    
*/

    update () {

    }
}
