/* global cash, Cash */
(function () {
    'use strict';
    var cash;
    describe('cashex', function () {
        var prefixed, suffixed, casual, formal, conversational;
        beforeEach(function () {
            cash = new Cash();
            cash.setValues({"USD": 1}).lookFor(["USD"]);
            prefixed = '$5';
            suffixed = '5 dollars';
            casual = 'five bucks';
            formal = 'USD 5.00';
            conversational = 'five American dollars';
        });
        afterEach(function () {
            cash = prefixed = suffixed = casual = formal = conversational = null;
        });

        it('should capture whether a cash expression is prefixed with the currency type', function () {
            cash.tag(prefixed);
            var cache = cash.register.cache;
            expect(cache[Object.keys(cache)[0]].prefixed).toBe(true);
            delete cache[Object.keys(cache)[0]];

            cash.tag(suffixed);
            expect(cache[Object.keys(cache)[0]].prefixed).toBe(false);
        });

        it('should capture the voice of a cash expression', function () {
            cash.tag(casual);
            var cache = cash.register.cache;
            expect(cache[Object.keys(cache)[0]].voice).toBe('casual');
            delete cache[Object.keys(cache)[0]];

            cash.tag(formal);
            expect(cache[Object.keys(cache)[0]].voice).toBe('formal');
            delete cache[Object.keys(cache)[0]];

            cash.tag(conversational);
            expect(cache[Object.keys(cache)[0]].voice).toBe('conversational');
            delete cache[Object.keys(cache)[0]];
        });
    });
})();
