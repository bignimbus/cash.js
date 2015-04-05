define(["exports", "module", "cash-main"], function (exports, module, _cashMain) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

    var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Cash = _interopRequire(_cashMain);

    var CashDom = (function (Cash) {
        function CashDom(options) {
            _classCallCheck(this, CashDom);

            _get(Object.getPrototypeOf(CashDom.prototype), "constructor", this).call(this, options, true);
        }

        _inherits(CashDom, Cash);

        _prototypeProperties(CashDom, {
            exchange: {
                value: function exchange(currency) {
                    currency = currency || this.register.current;
                    var obj = undefined,
                        rate = undefined,
                        cache = this.register.metadata;

                    for (id in cache) {
                        obj = {};
                        rate = this.register.currencies[currency].value;
                        Object.assign(cache[id], {
                            currency: currency,
                            rate: rate,
                            exactValue: cache[id].exactValue * rate
                        });
                    }
                },
                writable: true,
                configurable: true
            }
        }, {
            wrap: {
                value: function wrap(nodes) {
                    var _this = this;

                    nodes = (typeof nodes === "string" ? [nodes] : nodes) || [];
                    for (var node in nodes) {
                        node = nodes[node];
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
                    return this;
                },
                writable: true,
                configurable: true
            },
            setCurrency: {
                value: function setCurrency(currency) {
                    if (this.register.supportedCurrencies.indexOf(currency) === -1) {
                        throw new Error("currency not supported.");
                    }
                    this.register.current = currency;
                    this.constructor.exchange.call(this, currency);
                    return this;
                },
                writable: true,
                configurable: true
            },
            update: {
                value: function update() {
                    this.constructor.exchange.call(this);
                    return this;
                },
                writable: true,
                configurable: true
            }
        });

        return CashDom;
    })(Cash);

    module.exports = CashDom;
});