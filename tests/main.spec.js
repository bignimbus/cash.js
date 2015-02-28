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
        beforeEach(function () {
            cash = new Cash();
        });
        afterEach(function () {
            cash = null;
        });
        it('should detect all default permutations of USD', function () {
            // as additional defaults are added, this spec should be updated
            var usdHTML = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have $7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have $8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million dollars. Or USD 2 billion!"',
                    'said Leonard. "Right now, I only have five bucks :("',
                    'Raj offered to loan Leonard 15 $.',
                    '</p>'
                ].join(' '),
                processed = cash.addTags(usdHTML);
            expect(processed.match(/\/span/g).length).toBe(6);
        });
    });
})();
