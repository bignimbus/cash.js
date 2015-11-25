/* global cash, Cash */
(function () {
    'use strict';
    var cash;
    describe('cashex', function () {
        var prefixed, conversationalE, magnitude, suffixed, casual, formal, conversational, symbolic;
        beforeEach(function () {
            cash = new Cash();
            cash.setValues({
              "USD": 1,
              "EUR": 2,
              "GBP": 3
            }).lookFor("USD", "EUR");
            prefixed = '$5';
            suffixed = '5 dollars';
            casual = 'five bucks';
            formal = 'USD 5.00';
            conversational = 'five American dollars';
            conversationalE = '5 euros';
            magnitude = 'five cents';
            symbolic = 'five $';
        });
        afterEach(function () {
            cash = conversationalE = magnitude = prefixed = suffixed = casual = formal = conversational = symbolic = null;
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

            cash.tag(conversationalE);
            expect(cache[Object.keys(cache)[0]].voice).toBe('conversational');
            delete cache[Object.keys(cache)[0]];

            cash.tag(symbolic);
            expect(cache[Object.keys(cache)[0]].voice).toBe('symbolic');
            delete cache[Object.keys(cache)[0]];

            cash.tag(magnitude);
            expect(cache[Object.keys(cache)[0]].voice).toBe('conversational');
            delete cache[Object.keys(cache)[0]];
        });

        describe('when calling exchange', function () {
            beforeEach(function () {
              $('body').append('<div id="maintain-voice"></div>');
            });
            afterEach(function () {
              $('#maintain-voice').remove();
            });

            it('should maintain voice when exchanging currencies', function () {
              $('#maintain-voice').html(cash.tag(casual));
              cash.exchange('USD').for('GBP');
              expect($('#maintain-voice').children('.cash-node').first().text()).toBe('15 quid');
            });
        });
    });
})();
