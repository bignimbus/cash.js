export default class Cash {
    constructor (options) {
        options = options || {};
        this.nodes = options.nodes || [];
    }

    parse (nodes) {
        // this.nodes.concat(nodes || []);
        // this.nodes.forEach(function (node) {
        //     $node = $(node);
        // });
        return nodes;
    }
}