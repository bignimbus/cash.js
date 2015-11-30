(function () {
    'use strict';
    window.cash = new window.Cash();
    var $input = $('#input .copy'),
        $lookFor = $('.look-for'),
        $exchange = $('.exchange'),
        $submit = $('#submit');

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
        addHelperText();
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
        var $output = $('#output'),
            $text = $('#output .text');

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
            }, 500);
            $el.val('exchange for...');
        });
    }

    function addHelperText() {
        $input.text('Welcome to cash. To enter text into the DOM, type it in the text area and click "submit." Each time you submit new text, it is passed into cash\'s #tag method and then added.  <br><br>All money values, such as five bucks or $1,000,000.00 will be recognized and highlighted in green.  To change the currency/currencies to be parsed, click "looking for..."  To exchange all money values on the page to another currency, slick "exchange for..."<br><br>Please note that cash.js is data agnostic, so you can pipe in your own values.  This page is using a third-party api to get up-to-date exchange rate information.');
        $submit.click();
    }

    initialize();
})();
