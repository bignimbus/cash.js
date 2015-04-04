/* global cash, Cash */
(function () {
    var cash;
    describe('setCurrency', function () {

        beforeEach(function () {
            cash = new Cash();
        });

        afterEach(function () {
            cash = null;
        });

        it('should find the selected currency in the register and set the current property',
        function () {
            var error;
            cash.setValues({
                "USD": 1,
                "JPY": 100
            });
            cash.setCurrency("JPY");
            expect(cash.register.current).toBe("JPY");
            try {
                cash.setCurrency("INVALID");
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });

    describe('update', function () {
        var $node;

        beforeEach(function (done) {
            cash = new Cash();
            $('body').append('<p id="testing">I have $100 in my pocket.</p>');
            cash.wrap('#testing');
            $node = $('#testing .cash-node').first();

            cash.setValues({
                "USD": 1,
                "GBP": 2
            });
            cash.setCurrency("GBP");

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
            expect($node.html()).toBe('GBP 200');
            done();
        });
    });

    describe('update',function () {
        var $node;

        beforeEach(function (done) {
            cash = new Cash();
            $('body').append('<p id="testing-two">I have USD 30 in my pocket.</p>');
            cash.wrap('#testing-two');
            $node = $('#testing-two .cash-node').first();

            cash.setValues({
                "USD": 0.5
            });

            cash.update();

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
            expect($node.html()).toBe('USD 15');
            done();
        });
    });
})();
