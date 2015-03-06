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
        if (!$el) {
            throw new Error('please specify a jQuery object');
        }
        let html = $el.html() || null;
        if (html) {
            $el.html(super.tag(html));
        }
    }

    update () {
        this.settings.register.forEach(function (hash) {
            console.log(hash);
        });
    }
}
