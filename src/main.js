class Cash {
    constructor (options) {
        this.nodes = options.nodes || [];
    }

    parse (nodes) {
        this.nodes.concat(nodes);
        this.nodes.forEach(function (node) {
            $node = $(node);
        });
    }
}
export default Cash;
