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
                    cash.addTags(
                        filler.concat(dollarSign, nums, decimals, usd, filler).join('')
                    )
                )
            ).toBe(1);

            expect(
                cashCount(
                    cash.addTags(
                        filler.concat(filler, nums, filler).join('')
                    )
                )
            ).toBe(0);

            expect(
                cashCount(
                    cash.addTags(
                        filler.concat(decimals, dollarSign, ['or 50'], ['cents']).join('')
                    )
                )
            ).toBe(2);
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
                    '</p>'
                ].join(' '),
                processed = cash.addTags(usdHTML);

            expect(cashCount(processed)).toBe(6);
        });
    });
})();
