grunt build
mkdir -p ~/.cashjs-temporary
cp -f dist/cash.js ~/.cashjs-temporary/
git stash save 'cash-deploy'
git checkout gh-pages
cp -f ~/.cashjs-temporary/cash.js dist/cash.js
rm -rf ~/.cashjs-temporary/
