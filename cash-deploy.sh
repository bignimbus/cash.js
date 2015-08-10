grunt build
mkdir -p ~/.temporary
cp -f dist/cash.js ~/.temporary/
git stash save 'cash-deploy'
git checkout gh-pages
cp -f ~/.temporary/cash.js dist/cash.js
rm -rf ~/.temporary/
