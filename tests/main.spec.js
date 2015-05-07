/* global Cash, cash */
(function () {
    var cash, str;
    describe('Cash', function () {
        it('should instantiate', function () {
            cash = new Cash();
            expect(cash).toBeDefined();
            cash = null;
        });
    });

    describe('lookFor', function () {
        beforeEach(function () {
            cash = new Cash();
            str = 'I have $5.00 and ¥8,000.  Hey, don\'t you owe me 25 dollars?'
                + ' Or was it someone else?  Maybe it was 50 cents, or ¥50.';
        });

        afterEach(function () {
            cash = null;
            str = '';
        });

        it('should instruct the tag method to know which currencies to look for',
        function () {
            cash.lookFor('USD', 'JPY').tag(str);
            var node,
                currency,
                currenciesDetected = {};
            for (node in cash.register.metadata) {
                currency = cash.register.metadata[node].currency;
                currenciesDetected[currency] = (currenciesDetected[currency] || 0) + 1;
            }
            expect(currenciesDetected.USD).toBe(3);
            expect(currenciesDetected.JPY).toBe(2);
        });

        it('should interpret symbols that are shared between multiple currencies'
        + ' as being associated with the last listed currency', function () {
            cash.lookFor('USD', 'AUD', 'JPY', 'CNY').tag(str);
            var node,
                currency,
                currenciesDetected = {};
            for (node in cash.register.metadata) {
                currency = cash.register.metadata[node].currency;
                currenciesDetected[currency] = (currenciesDetected[currency] || 0) + 1;
            }
            expect(currenciesDetected.AUD).toBe(3);
            expect(currenciesDetected.CNY).toBe(2);
        });
    });

    describe('tag', function () {
        function cashCount (str) {
            var match = str.match(/\/span/g);
            return match ? match.length : 0;
        }

        beforeEach(function () {
            cash = new Cash();
        });

        afterEach(function () {
            cash = null;
        });

        it('should parse all cash strings into values and store them in the "cache register"',
        function () {
            cash.tag('five dollars');
            var obj = cash.register.cache,
                key = Object.keys(obj)[0];
            expect(obj[key].coefficient).toBe(5);
        });

        it('should parse all numbers, decimals and commas into values and store them in the "cache register"',
        function () {
            cash.tag('$5,100.40');
            var obj = cash.register.cache,
                key = Object.keys(obj)[0];
            expect(obj[key].coefficient).toBe(5100.40);
        });

        it('should parse all magnitude strings into multipliers and store them in the "cache register"',
        function () {
            cash.tag('one hundred billion dollars');
            var obj = cash.register.cache,
                key = Object.keys(obj)[0];
            expect(obj[key].magnitude).toEqual([1e2, 1e9]);
        });

        it('should store the exact value of the money string in the "cache register"',
        function () {
            cash.tag('if I had a million dollars...');
            var obj = cash.register.cache,
                key = Object.keys(obj)[0];
            expect(obj[key].exactValue).toBe(1000000);
        });

        it('should filter all caught currency strings through functions defined by the dev',
        function () {
            var count = 0;
            cash.addFilters(function (str) {
                count++;
                return str.length > 2;
            }, function (str) {
                count++;
                return /\d/.test(str);
            });
            expect(cash.register.filters.length).toBe(2);
            cash.tag('$5.00, and ten million bucks');
            expect(count).toBe(4);
            expect(Object.keys(cash.register.cache).length).toBe(1);
        });
    });

    describe('setValues', function () {

        beforeEach(function () {
            cash = new Cash();
        });

        afterEach(function () {
            cash = null;
        });

        it('should validate and populate the register with provided exchange rates', function () {
            cash.setValues({
                "USD": 1,
                "EUR": 0.92,
                "JPY": "120.83",
                "INR": "not a valid input",
                "NOPE": "nopenopenope"
            });
            expect(cash.register.currencies.USD.value).toBe(1);
            expect(cash.register.currencies.EUR.value).toBe(0.92);
            expect(cash.register.currencies.JPY.value).toBe(120.83);
            expect(cash.register.currencies.INR.value).toBeUndefined();
            expect(cash.register.currencies.NOPE).toBeUndefined();
        });
    });

    describe('setLocale', function () {
        beforeEach(function () {
            cash = new Cash();
        });

        afterEach(function () {
            cash = null;
        });

        it('should set the locale in the register', function () {
            cash.setLocale('en-CA');
            expect(cash.register.formatting.locale).toBe('en-CA');
        });
    });
})();
