# cash.js
modules for processing, parsing, computing and exchange-rate-swapping money strings. Works as a templating module, also hooks into the DOM.

## Working example
I made a quick demonstration of how cash works.  Check it out at [this project's github page](http://bignimbus.github.io/cash.js/).

## Contents
* [What this does](#what-this-does)
* [How this serves users and developers](#how-this-serves-users-and-developers)
* [Currency support](#currency-support)
* [Configurations](#configurations)
* [Instantiate](#instantiate)
* [Settings](#settings)
* [Core Methods](#core-methods)
* [Client-Side Methods](#client-side-methods)
* [Contributing](#contributing)

## What this does
cash.js is a money-finder.  Give it a string or a DOM node, and its regular expression engine will find anything that looks like it's talking about a money amount and wrap it in a `span` tag with a `cash-node` class and a unique alphanumeric `id` tag which is also persisted in memory.  It also exposes a few useful methods for updating those strings post-render, including an elegant way to pass in exchange rates and dynamically update the DOM with new money information.  This makes localization a snap.

## How this serves users and developers
When delivering content, it's very easy to be currency-biased.  If your backend or API doesn't support displaying money figures in local currencies, you may be alienating your users who may not know the Ruble - Peso exchange rate (for instance).  Since cash.js is lightweight and can be deployed on the server via node, used pre-template on the client side, or applied directly to the DOM after rendering (or any combination thereof), there's no excuse for not internationalizing your money values.

## Currency support
cash.js comes with [support for a handful of major currencies](https://github.com/bignimbus/cash.js/blob/master/src/currencies.js) out of the box, but is infinitely extensible.  In addition to traditional currencies, you can set, swap and display exchange rates for cryptocurrencies, virtual currencies, stock prices, toothbrush prices, whatever!  If you have the data, cash.js will make sure that the user can see it in a performant way.

## Configurations
Cash currently has two distributions: `cash-lite`, which houses the regex engine and templating utility; and `cash`, which is dependent on jQuery and houses the DOM manipulation library and other client-side features.  I intend to make `cash-lite` into an [npm](!https://www.npmjs.com/) module in the near future.

## Install
```
bower install cash.js
```
npm module coming soon!

## Instantiate

```js
var cash = new Cash(options);
```

The `Cash` object is a constructor so more than one instance can be loaded (use this pattern with caution).

## Settings
`cash`'s power comes from its ability to be modified and extended.  On instantiation, `cash`'s [register](https://github.com/bignimbus/cash.js/blob/master/src/register.js) (my cheeky name for "settings") hash is extended by the passed `options` hash using Object.assign (not a deep copy).  The [register](https://github.com/bignimbus/cash.js/blob/master/src/register.js) source annotates the configurable parameters.  If you are adding a currency, consider forking this repo and submitting a pull request with the new configurations.  You can never have too much `cash`!

## Core methods
These methods are supported in `cash-lite` and `cash`.

### lookFor(string[, string, ...])
Tells `cash` what currencies you expect to be rendered in the DOM.  This helps make sure `cash` isn't confused by currencies that share symbols (like Japanese Yen and Chinese Yuan).  In the event that a certain symbol is shared by more than one currencies listed in the arguments, `cash` will default to the last currency.

```js
cash.lookFor('USD', 'GBP', 'MXN', 'RUB');
// because 'MXN' is listed after 'USD' and the term 'cents' is shared between these
// two currencies, cash will interpret 'cents' as 0.01 Mexican Pesos.
```

### tag(string)
Given a string, finds all substrings that represent a money figure, wraps them in span tags, parses their values, and stores them in memory.  Notice that there are no data-attributes or any other persistence layer in the DOM itself, just a class and a unique id.  All values are stored in the `cash.register` (lol) object in memory.  `cash` is pretty smart out of the box and understands that if you have 'GBP' in your `lookFor` method, 'five quid' (for example) means £5.00.  This behavior is configurable.

```js
var demand = 'I want one million dollars in cash.';
cash.lookFor('USD').tag(demand);

// output:
'I want <span id="abcd1234" class="cash-node">one million dollars</span> in cash.'
```

### addFilters(function, [function, ...])
cash.js has a very broad regex engine that will catch lots of different permutations of money strings, including natural language (e.g. 'five bucks' is understood to be $5.00).  If you want your cash instance to be more selective, pass a callback or callbacks that return a boolean, similar to [Array.prototype.every](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).  The one key difference is that `addFilters` allows you to pass in an arbitrary number of callbacks.

```js
var sample = 'I got five bucks the other day.  That\'s five dollars, or $5.00!',
    noBucks = function (str) {
        return !/bucks?/i.test(str);
    },
    noDollars = function (str) {
        return !/dollars?/i.test(str);
    };

cash.tag(sample);

// output:
'I got <span id="asdf3456" class="cash-node">five bucks</span> the other day.  That\'s <span id="3457gby3" class="cash-node">five dollars</span>, or <span id="urmng731" class="cash-node">$5.00</span>!'

cash.addFilters(noBucks, noDollars)
    .tag(sample);

// output with filters:
'I got five bucks the other day.  That\'s five dollars, or <span id="efgh5678" class="cash-node">$5.00</span>!'
```

### setValues(object)
Pass this method a hash of exchange rates and it will update these values in memory.  This will not trigger a DOM update in `cash`, nor will it affect the templating engine in any way.  It is important to maintain even ratios - `cash` assumes you know what you're doing with the data you're providing.  It is recommended that your default currency always be set to `1`.  Trust me, it'll make your life easier.

```js
cash.setValues({
    "USD": 1,
    "EUR": 0.9,
    "JPY": 100
});
```

## Client-side methods
These methods are supported in `cash.js` and are designed for client-side use only.

### wrap(string OR [string, string...])
Like [tag](#tag-string-), but instead of passing a string, just pass a jQuery selector or array of jQuery selectors.  `cash.js` will crawl the DOM and wrap all money strings in those elements.  This method is often chained with `lookFor`.

```html
<!-- index.html, before -->
<h1 class="hodor">HODOR hodor hodor HODOR $3.50 hodor HODOR</h1>
<p id="quick-brown-fox">The quick, brown fox jumped over the lazy dog.  And then the lazy dog found USD 300 on the ground.</p>
```

```js
// main.js
var els = ['#quick-brown-fox', '.hodor'];
cash.lookFor('USD').wrap(els);
```

```html
<!-- index.html, after -->
<h1 class="hodor">HODOR hodor hodor HODOR  <span id="u404x36usor" class="cash-node">$3.50</span> hodor HODOR</h1>
<p id="quick-brown-fox">The quick, brown fox jumped over the lazy dog.  And then the lazy dog found  <span id="e3swo4dkj4i" class="cash-node">USD 300</span> on the ground.</p>
```

### exchange(string[, string, ...]).for(string)
The best part: change the displayed currencies and update the values according to the exchange rate persisted in the register.

```html
<!-- index.html, before -->
<p id="quick-brown-fox">The quick, brown fox jumped over the lazy dog.  And then the lazy dog found  <span id="e3swo4dkj4i" class="cash-node">USD 300</span> on the ground.  After celebrating, he withdrew <span id="4fdj4999sd" class="cash-node">JPY 700,000</span> from his Tokyo bank account.</p>
```

```js
// main.js
cash.setValues({
        "USD": 1,
        "JPY": 100,
        "MXN": 15
    })
    .exchange('JPY', 'USD').for('MXN');
```

```html
<!-- index.html, after -->
<p id="quick-brown-fox">The quick, brown fox jumped over the lazy dog.  And then the lazy dog found  <span id="e3swo4dkj4i" class="cash-node">MXN 4500.00</span> on the ground.  After celebrating, he withdrew <span id="4fdj4999sd" class="cash-node">MXN 105000.00</span> from his Tokyo bank account.</p>
```

### update()
Instructs `cash` to update the DOM with current values.  If you are deploying `cash` on a view with a constantly-updating data model, just call `cash.update()` and the DOM will display the data that `cash` currently has in memory.  This allows `cash` to be used to easily create a stock ticker, for example.

```html
<!-- index.html, before -->
<span class="stock-ticker">current stock prices: <span id="djen6583d" class="cash-node">GOOG-530</span></span>
```

```js
// main.js
$.ajax({
    "url": "www.fakeapi.com/stock-prices?symbol=GOOG",
    "success": function () {
        cash.setValues({
                // this is possible, but you need to explicitly configure this
                // in the currencies object
                "GOOG": 540
            })
            .update();
    }
});
```

```html
<!-- index.html, after -->
<span class="stock-ticker">current stock prices: <span id="djen6583d" class="cash-node">GOOG-540.00</span></span>
```

## Contributing
cash.js is written using ES6 syntax, transpiled to AMD modules using [babel](!https://babeljs.io/docs/using-babel/).  AMD modules are compiled into one global module via [AMDClean](https://github.com/gfranko/amdclean).  The DOM module also makes use of [Object.observe](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) and [Object.assign](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), so there are some polyfill dependencies.

Want to help? Clone and `npm install --save-dev`.  I will try to keep track of current issues once the repo approaches stability.  There is a precommit hook that builds the app and runs the tests.  No need to run the build task unless you feel like it.
