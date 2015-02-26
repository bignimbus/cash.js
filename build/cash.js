"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Cash = (function () {
    function Cash(options) {
        _classCallCheck(this, Cash);

        this.nodes = options.nodes || [];
    }

    _prototypeProperties(Cash, null, {
        parse: {
            value: function parse(nodes) {
                this.nodes.concat(nodes);
                this.nodes.forEach(function (node) {
                    $node = $(node);
                });
            },
            writable: true,
            configurable: true
        }
    });

    return Cash;
})();

module.exports = Cash;
//# sourceMappingURL=cash.js.map