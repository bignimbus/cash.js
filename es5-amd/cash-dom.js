define(["exports", "module", "money-finder", "cash-main"], function (exports, module, _moneyFinder, _cashMain) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var MoneyFinder = _interopRequire(_moneyFinder);

    var Cash = _interopRequire(_cashMain);

    var CashDom = (function (Cash) {
        function CashDom(options) {
            _classCallCheck(this, CashDom);

            _get(Object.getPrototypeOf(CashDom.prototype), "constructor", this).call(this, options);
        }

        _inherits(CashDom, Cash);

        _prototypeProperties(CashDom, null, {
            grab: {
                value: function grab(nodes) {
                    var _this = this;

                    nodes = (typeof nodes === "string" ? [nodes] : nodes) || [];
                    for (var _iterator = nodes[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                        var node = _step.value;

                        $(node).each(function (i, el) {
                            _this.wrap($(el));
                        });
                    }
                },
                writable: true,
                configurable: true
            },
            wrap: {
                value: function wrap($el) {
                    var html = $el.html();
                    $el.html(this.addTags(html));
                },
                writable: true,
                configurable: true
            }
        });

        return CashDom;
    })(Cash);

    module.exports = CashDom;
});