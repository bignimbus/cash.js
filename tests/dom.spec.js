/* global cash, Cash */
(function () {
    var cash,
        $node,
        isPhantom = /phantomjs/i.test(window.navigator.userAgent);

    describe('exchange.for', function () {
        beforeEach(function (done) {
            cash = new Cash();
            $('body').append('<p id="testing">I have $100 in my pocket.</p>');
            cash.wrap('#testing');
            $node = $('#testing .cash-node').first();

            cash.setValues({
                    "USD": 1,
                    "GBP": 2
                })
                .exchange("USD")
                .for("GBP");

            var timer = window.setTimeout(function () {
                    done();
                    window.clearTimeout(timer);
                }, 300);
        });

        afterEach(function () {
            cash = null;
            $node = null;
        });

        it('should update the DOM with the stored exchange rate values', function (done) {
            var gbp200 = isPhantom? 'GBP 200' : 'GBP 200.00';
            expect($node.html()).toBe(gbp200);
            done();
        });
    });

    describe('exchange.for', function () {
        var nodes;

        beforeEach(function (done) {
            cash = new Cash();

            $('body').append('<p id="multi">I have $100 in my pocket, 50 euros in my Swiss bank account and 100 crore INR waiting for me in India.</p>');

            cash.lookFor('INR', 'USD', 'EUR')
                .wrap('#multi');

            nodes = $('#multi .cash-node');

            cash.setValues({
                    "USD": 1,
                    "EUR": 2,
                    "INR": 8,
                    "GBP": 4
                })
                .exchange('INR', 'USD', 'EUR')
                .for('GBP');

            var timer = window.setTimeout(function () {
                    done();
                    window.clearTimeout(timer);
                }, 300);
        });

        afterEach(function () {
            cash = null;
            nodes = null;
        });

        it('should be able to exchange multiple currencies for another currency', function (done) {
            var gbp400 = isPhantom ? 'GBP 400' : 'GBP 400.00',
                gbp100 = isPhantom ? 'GBP 100' : 'GBP 100.00',
                gbpalot = isPhantom ? 'GBP 500000000' : 'GBP 500,000,000.00';
            expect($(nodes[0]).html()).toBe(gbp400);
            expect($(nodes[1]).html()).toBe(gbp100);
            expect($(nodes[2]).html()).toBe(gbpalot);
            done();
        });
    });

    describe('update', function () {
        beforeEach(function (done) {
            cash = new Cash();
            $('body').append('<p id="testing-two">I have USD 30 in my pocket.</p>');
            cash.wrap('#testing-two');
            $node = $('#testing-two .cash-node').first();

            cash.setValues({
                    "USD": 0.5
                })
                .update();

            var timer = window.setTimeout(function () {
                    done();
                    window.clearTimeout(timer);
                }, 300);

        });

        afterEach(function () {
            cash = null;
            $node = null;
        });

        it('should update the dom with current values when called', function (done) {
            var usd15 = isPhantom ? 'USD 15' : 'USD 15.00';
            expect($node.html()).toBe(usd15);
            done();
        });
    });

    describe('update', function () {
        beforeEach(function (done) {
            cash = new Cash({"formatting": {
                "useGrouping": false,
                "round": true
            }});
            $('body').append('<p id="testing-three">I have USD 7000000.24 in my safe.</p>');

            cash.wrap('#testing-three')
                .setValues({
                    "USD": 1,
                    "GBP": 1
                })
                .exchange('USD').for('GBP');

            $node = $('#testing-three .cash-node').first();

            var timer = window.setTimeout(function () {
                    done();
                    window.clearTimeout(timer);
                }, 300);
        });
        afterEach(function () {
            cash = null;
            $node = null;
        });

        it('should accept params for grouping (commas) and rounding', function (done) {
            var gbp7000000 = isPhantom ? 'GBP 7000000.24' : 'GBP 7000000';
            expect($node.html()).toBe(gbp7000000);
            done();
        });
    });
})();
