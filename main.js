(function () {
    window.cash = new window.Cash();

    var $lookFor = $('.look-for'),
        $exchange = $('.exchange');

    function initialize () {
        var currencies = Object.keys(cash.register.currencies);

        currencies.forEach(function (currency) {
            var checked = cash.register.supported.indexOf(currency) > -1 ? ' checked' : '';
            if (checked) {
                $lookFor.children('button').append(' ' + currency);
            }
            $lookFor.children('ul').append('<li><label><input type="checkbox" value="' + currency
                + '" id="' + currency + '"' + checked + '>' + currency + '</label></li>');
            $exchange.append('<option value="' + currency + '">' + currency + '</option>');
        });

        setValues();

        addEventListeners();
    }

    function setValues () {
        var supportedCurrencies = Object.keys(cash.register.currencies).join(',');
        $.ajax({
            "type": "GET",
            "url": 'http://www.apilayer.net/api/live?access_key=53037019af615c2e5d1a6df9f1c5470d&format=1&currencies=' + supportedCurrencies
        }).done(function (response) {
            var obj = {}, currency;
            for (currency in response.quotes) {
                obj[currency.replace(/^.{3}/, '')] = response.quotes[currency];
            }
            cash.setValues(obj);
        }).fail(function () {
            console.log('ajax request failed');
        });
    }

    function addEventListeners () {
        var $input = $('#input .copy'),
            $output = $('#output');
            $text = $('#output .text'),
            $submit = $('#submit');
        $('body').on('click', '#submit', function () {
            var newHTML = $text.html() + '<p>' + cash.tag($input.val()) + '</p>';
            $text.html(newHTML);
            $output.animate({
                "scrollTop": $output[0].scrollHeight
            }, 500);
            $input.val('');
        })
        .on('keypress', '.copy', function (e) {
            if (e.which === 13) {
                $submit.click();
            }
        })
        .on('click', '.look-for', function () {
            $(this).children('ul').toggleClass('show');
        })
        .on('change', '.look-for input', function () {
            var html,
                $el = $(this),
                currency = $el.val(),
                $button = $lookFor.children('button');
            if ($el.is(':checked')) {
                if (!new RegExp(currency).test($button.html())) {
                    $button.append(' ' + currency);
                }
                cash.lookFor = cash.register.supported.push(currency);
            } else {
                html = $button.html();
                $button.html(html.replace(' ' + currency, ''));
                cash.register.supported = cash.register.supported.filter(function (supported) {
                    return supported !== currency;
                });
                cash.lookFor = cash.register.supported;
            }
        })
        .on('change', '.exchange', function () {
            var $el = $(this),
                currency = $el.val();
            cash.exchange(cash.register.supported).for(currency);
            window.setTimeout(function () {
                $('#' + currency).attr('checked', 'checked').trigger('change');
            }, 2000);
            $el.val('exchange for...');
        });
    }

    initialize();
})();