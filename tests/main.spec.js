/* global Cash, cash */
(function () {
    var cash;
    describe('Cash', function () {
        it('should instantiate', function () {
            cash = new Cash();
            expect(cash).toBeDefined();
            cash = null;
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
})();
