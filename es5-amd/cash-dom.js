define(["exports", "module", "cash-main"], function (exports, module, _cashMain) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Cash = _interopRequire(_cashMain);

    var CashDom = (function (_Cash) {
        function CashDom(options) {
            _classCallCheck(this, CashDom);

            options = options || {};
            _get(Object.getPrototypeOf(CashDom.prototype), "constructor", this).call(this, options, true);
            this.register.metadata = {};
            if (options.metadata) {
                for (var id in options.metadata) {
                    this.register.cache = options.metadata[id];
                }
            }
        }

        _inherits(CashDom, _Cash);

        _createClass(CashDom, {
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
                }
            },
            exchange: {
                value: function exchange() {
                    var _this2 = this;

                    for (var _len = arguments.length, currencies = Array(_len), _key = 0; _key < _len; _key++) {
                        currencies[_key] = arguments[_key];
                    }

                    if (currencies[0] instanceof Array) {
                        currencies = currencies[0];
                    }
                    currencies.forEach(function (currency) {
                        if (_this2.register.supportedCurrencies.indexOf(currency) === -1) {
                            throw new Error("" + currency + " not supported.");
                        }
                    });
                    this["for"] = (function (targets, source) {
                        _this2.constructor.recalculate.call(_this2, source, targets);
                    }).bind(this, currencies);
                    return this;
                }
            },
            update: {
                value: function update() {
                    this.constructor.recalculate.call(this);
                    return this;
                }
            }
        }, {
            recalculate: {
                value: function recalculate(source, targets) {
                    var obj = undefined,
                        rate = undefined,
                        current = undefined,
                        oldRate = undefined,
                        multiplier = undefined,
                        cache = this.register.metadata;

                    for (id in cache) {
                        if (targets && targets.indexOf(cache[id].currency) === -1) {
                            continue;
                        }
                        cache[id].recalculate(source);
                    }
                    if (this["for"]) {
                        this["for"] = null;
                    }
                }
            }
        });

        return CashDom;
    })(Cash);

    module.exports = CashDom;
});