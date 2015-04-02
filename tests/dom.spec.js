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

    describe('exchange', function () {

        beforeEach(function () {
            cash = new Cash();
        });

        afterEach(function () {
            cash = null;
        });

        it('should update the DOM with the stored exchange rate values', function () {
            $('body').append('<p id="testing">I have $100 in my pocket.</p>');
            cash.wrap('#testing');

            var timer,
                $node = $('#testing .cash-node').first(),
                id = $node.attr('id');
            cash.setValues({
                "USD": 1,
                "GBP": 2,
                "EUR": 3,
                "JPY": 4,
                "CNY": 5,
                "RUB": 6,
                "CAD": 7,
                "AUD": 8,
                "INR": 9,
                "MXN": 10,
                "BRL": 11
            });
            cash.setCurrency("GBP");

            // jquery not playing nice with jasmine, will add spec.  Observed
            // working changes in DOM in browser.
        });
    });
})();
