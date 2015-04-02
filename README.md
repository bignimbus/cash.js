# cash.js
modules for processing, parsing, computing and exchange-rate-swapping money strings. Works as a templating module, also hooks into the DOM.

## Under construction - do not use in production!

## What this does
cash.js is a money-finder.  Give it a string or a DOM node, and its regular expression engine will find anything that looks like it's talking about a money amount and wrap it in a `span` tag with a `cash-node` class and a unique alphanumeric `id` tag which is also persisted in memory.  It also exposes a few useful methods for updating those strings post-render, including an elegant way to pass in exchange rates and dynamically update the DOM with new money information.  This makes localization a snap.

## How this serves users and developers
When delivering content, it's very easy to be currency-biased.  If your backend or API doesn't support displaying money figures in local currencies, you may be alienating your users who may not know the Ruble - Peso exchange rate (for instance).  Since cash.js is lightweight and can be deployed on the server via node, used pre-template on the client side, or applied directly to the DOM after rendering (or any combination thereof), there's no excuse for not internationalizing your money values.

## Currency support
cash.js comes with support for a handful of major currencies out of the box, but is infinitely extensible.  In addition to traditional currencies, you can set, swap and display exchange rates for cryptocurrencies, virtual currencies, stock prices, toothbrush prices, whatever!  If you have the data, cash.js will make sure that the user can see it in a performant way.

## Configurations
Cash currently has two distributions: `cash-lite`, which houses the regex engine and templating utility; and `cash`, which is dependent on jQuery and houses the DOM manipulation library and other client-side features.  I intend to make `cash-lite` into an [npm](!https://www.npmjs.com/) module in the near future.

## Instantiate

```js
var cash = new Cash(options);
```

## Main Methods
These methods are supported in `cash-lite` and `cash`.

### tag(string)
Given a string, finds any money values and wraps them:

```js
var demand = 'I want one million dollars in cash.';
cash.tag(demand);

// output:
'I want <span id="abcd1234" class="cash-node">one million dollars</span> in cash.'
```

### addFilters(function, [function, ...])
cash.js has a very broad regex engine that will catch lots of different permutations of money strings, including natural language (e.g. `'five bucks'` is understood to be $5.00).  If you want your cash instance to be more selective, pass a callback or callbacks that return a boolean, similar to [Array.prototype.every](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).  The one key difference is that `addFilters` allows you to pass in an arbitrary number of callbacks.

```js
let sample = 'I got five bucks the other day.  That's five dollars, or $5.00!',
    noBucks = (str) => !/bucks?/i.test(str),
    noDollars = (str) => !/dollars?/i.test(str);

cash.tag(sample);

// output:
'I got <span id="asdf3456" class="cash-node">five bucks</span> the other day.  That's <span id="3457gby3" class="cash-node">five dollars</span>, or <span id="urmng731" class="cash-node">$5.00</span>!'

cash.addFilters(noBucks, noDollars);
cash.tag(sample);

// output with filters:
'I got five bucks the other day.  That's five dollars, or <span id="efgh5678" class="cash-node">$5.00</span>!'
```

## Contributing
cash.js is written using ES6 syntax, transpiled using [babel](!https://babeljs.io/docs/using-babel/).  The DOM module also makes use of [Object.observe](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) and [Object.assign](!https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), so there are some polyfill dependencies.  Want to help? Clone and `npm install --save-dev`.  I will try to keep track of current issues once the initial alpha product is stable enough.
