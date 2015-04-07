/* global Cash, cash */
(function () {
    var cash;
    function cashCount (str) {
        var match = str.match(/\/span/g);
        return match ? match.length : 0;
    }
    describe('regex engine and configuration', function () {

        beforeEach(function () {
            cash = new Cash();
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

            expect(
                cashCount(
                    cash.tag(
                        filler.concat(' ', dollarSign, nums, ' ', filler).join('')
                    )
                )
            ).toBe(1);
        });

        it('should detect all default permutations of USD', function () {
            var samplehtml = [
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
                    'Raj checked his bank account - he had 5 hundred thousand American dollars.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of GBP', function () {
            cash.setCurrency("GBP");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have £7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have £ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million pounds. Or GBP 2 billion!"',
                    'said Leonard. "Right now, I only have five quid GBP :("',
                    'Raj offered to loan Leonard 15 £.',
                    'Meanwhile, Howard\'s Apple stock went to 150GBP.',
                    'Raj checked his bank account - he had 5 hundred thousand English pounds.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of EUR', function () {
            cash.setCurrency("EUR");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have €7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have € 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million euro. Or EUR 2 billion!"',
                    'said Leonard. "Right now, I only have five euros :("',
                    'Raj offered to loan Leonard 15 €.',
                    'Meanwhile, Howard\'s Apple stock went to 150EUR.',
                    'Raj checked his bank account - he had 5 hundred thousand Euros.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of JPY', function () {
            cash.setCurrency("JPY");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have ¥7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have ¥ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million yen. Or JPY 2 billion!"',
                    'said Leonard. "Right now, I only have five yen :("',
                    'Raj offered to loan Leonard 15 ¥.',
                    'Meanwhile, Howard\'s Apple stock went to 150JPY.',
                    'Raj checked his bank account - he had 5 hundred thousand Japanese yen.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of CNY', function () {
            cash.setCurrency("CNY");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have ¥7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have ¥ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million yuan. Or CNY 2 billion!"',
                    'said Leonard. "Right now, I only have five yuan :("',
                    'Raj offered to loan Leonard 15 ¥.',
                    'Meanwhile, Howard\'s Apple stock went to 150CNY.',
                    'Raj checked his bank account - he had 5 hundred thousand Chinese yuan.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of RUB', function () {
            cash.setCurrency("RUB");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have руб7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have руб 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million rubles. Or RUB 2 billion!"',
                    'said Leonard. "Right now, I only have five rubles :("',
                    'Raj offered to loan Leonard 15 руб.',
                    'Meanwhile, Howard\'s Apple stock went to 150RUB.',
                    'Raj checked his bank account - he had 5 hundred thousand Russian rubles.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of CAD', function () {
            cash.setCurrency("CAD");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have $7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have $ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million dollars. Or CAD 2 billion!"',
                    'said Leonard. "Right now, I only have five bucks CAD :("',
                    'Raj offered to loan Leonard 15 $.',
                    'Meanwhile, Howard\'s Apple stock went to 150CAD.',
                    'Raj checked his bank account - he had 5 hundred thousand Canadian dollars.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of AUD', function () {
            cash.setCurrency("AUD");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have $7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have $ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million dollars. Or AUD 2 billion!"',
                    'said Leonard. "Right now, I only have five bucks AUD :("',
                    'Raj offered to loan Leonard 15 $.',
                    'Meanwhile, Howard\'s Apple stock went to 150AUD.',
                    'Raj checked his bank account - he had 5 hundred thousand Australian dollars.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of INR', function () {
            cash.setCurrency("INR");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have Rs.7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have 8 lakh in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe one crore rupees. Or INR 2 billion!"',
                    'said Leonard. "Right now, I only have five paise :("',
                    'Raj offered to loan Leonard 15 Rs.',
                    'Meanwhile, Howard\'s Apple stock went to 150INR.',
                    'Raj checked his bank account - he had 5 hundred thousand Indian rupees.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of MXN', function () {
            cash.setCurrency("MXN");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have Mex$7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have $ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million pesos. Or MXN 2 billion!"',
                    'said Leonard. "Right now, I only have five centavos :("',
                    'Raj offered to loan Leonard 15 Mex$.',
                    'Meanwhile, Howard\'s Apple stock went to 150MXN.',
                    'Raj checked his bank account - he had 5 hundred thousand Mexican pesos.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });

        it('should detect all default permutations of BRL', function () {
            cash.setCurrency("BRL");
            var samplehtml = [
                    '<p>',
                    'My name is Sheldon.',
                    'I have R$7.50 in my pocket. Meh.',
                    'My name is Penny.',
                    'I have R$ 8,000 in my checking account;',
                    'not bad, but I\'d like some more.',
                    '"Maybe a million reales. Or BRL 2 billion!"',
                    'said Leonard. "Right now, I only have five cents :("',
                    'Raj offered to loan Leonard 15 R$.',
                    'Meanwhile, Howard\'s Apple stock went to 150BRL.',
                    'Raj checked his bank account - he had 5 hundred thousand Brasilian reales.',
                    '</p>'
                ].join(' '),
                processed = cash.tag(samplehtml);
            expect(cashCount(processed)).toBe(8);
        });
    });
})();