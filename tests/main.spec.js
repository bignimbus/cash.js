/* global Cash, cash */
(function () {
    'use strict';
    var cash;
    describe('Cash', function () {
        it('should instantiate', function () {
            cash = new Cash();
            expect(cash).toBeDefined();
            cash = null;
        });
    });

    describe('buildRegex', function () {
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

        it('should detect the start and stop of any valid money string', function () {
            // TODO abstract this to iterate through all default settings
            var filler = [' blah blah '],
                dollarSign = ['$'],
                usd = ['USD'],
                bucks = ['bucks'],
                one = ['one'],
                a = ['a'],
                dollars = ['dollars'],
                nums = ['12345'],
                decimals = ['.50'];
            expect(
                cashCount(
                    cash.tag(
                        filler.concat(dollarSign, nums, decimals, usd, filler).join('')
                    )
                )
            ).toBe(1);

            expect(
                cashCount(
                    cash.tag(
                        filler.concat(filler, nums, filler).join('')
                    )
                )
            ).toBe(0);

            expect(
                cashCount(
                    cash.tag(
                        filler.concat(decimals, dollarSign, ['or 50'], ['cents']).join('')
                    )
                )
            ).toBe(2);

            expect(
                cashCount(
                    cash.tag(
                        filler.concat(bucks, nums, filler).join(' ')
                    )
                )
            ).toBe(0);

            expect(
                cashCount(
                    cash.tag(
                        filler.concat(nums, dollars, filler).join(' ')
                    )
                )
            ).toBe(1);
        });

        it('should detect all default permutations of USD', function () {
            var usdHTML = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have $7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have $ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million dollars. Or USD 2 billion!"',
                    'said Leonard. "Right now, I only have five bucks USD :("',
                    'Raj offered to loan Leonard 15 $.',
                    'Meanwhile, Howard\'s Apple stock went to 150USD.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(usdHTML);
            expect(cashCount(processed)).toBe(7);
        });

        it('should parse all cash strings into values and store them in the "cache register"',
        function () {
            cash.tag('five dollars');
            var obj = cash.settings.register,
                key = Object.keys(obj[0])[0];
            expect(obj[0][key].coefficient).toBe(5);
        });

        it('should parse all numbers, decimals and commas into values and store them in the "cache register"',
        function () {
            cash.tag('$5,100.40');
            var obj = cash.settings.register,
                key = Object.keys(obj[0])[0];
            expect(obj[0][key].coefficient).toBe(5100.40);
        });

        it('should parse all magnitude strings into multipliers and store them in the "cache register"',
        function () {
            cash.tag('one hundred billion dollars');
            var obj = cash.settings.register,
                key = Object.keys(obj[0])[0];
            expect(obj[0][key].magnitude).toEqual([1e2, 1e9]);
        });

        it('should store the exact value of the money string in the "cache register"',
        function () {
            cash.tag('if I had a million dollars...');
            var obj = cash.settings.register,
                key = Object.keys(obj[0])[0];
            expect(obj[0][key].exactValue).toBe(1000000);
        });
    });
})();
