define(["exports", "module", "cash-main"], function (exports, module, _cashMain) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Cash = _interopRequire(_cashMain);

    var CashDom = (function (Cash) {
        function CashDom(options) {
            _classCallCheck(this, CashDom);

            _get(Object.getPrototypeOf(CashDom.prototype), "constructor", this).call(this, options);
        }

        _inherits(CashDom, Cash);

        _prototypeProperties(CashDom, null, {
            wrap: {
                value: function wrap(nodes) {
                    var _this = this;

                    nodes = (typeof nodes === "string" ? [nodes] : nodes) || [];
                    for (var _iterator = nodes[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                        var node = _step.value;

                        $(node).each(function (i, el) {
                            var $el = $(el),
                                html = $el.html() || "";
                            html = html.replace(/<span id="\w*?"\sclass="cash-node">([^<]*?)<\/span>/gi, function (m, text) {
                                return text;
                            });
                            if (html) {
                                $el.html(_get(Object.getPrototypeOf(CashDom.prototype), "tag", _this).call(_this, html));
                            }
                        });
                    }
                },
                writable: true,
                configurable: true
            },
            update: {

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

                value: function update() {
                    for (var _iterator = this.register.cache[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                        var _step$value = _slicedToArray(_step.value, 2);

                        var id = _step$value[0];
                        var data = _step$value[1];
                    }
                },
                writable: true,
                configurable: true
            }
        });

        return CashDom;
    })(Cash);

    module.exports = CashDom;
});