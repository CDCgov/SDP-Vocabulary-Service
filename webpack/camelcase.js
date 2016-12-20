// Copied from https://github.com/sindresorhus/camelcase/blob/master/index.js
// Not installed via npm since we have node_modules excluded from our babel
// pipeline. Since this uses ES6, it causes the capybara stack to be sad because
// it runs across the 'let' keyword.
function preserveCamelCase(str) {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < str.length; i++) {
    const c = str[i];

    if (isLastCharLower && (/[a-zA-Z]/).test(c) && c.toUpperCase() === c) {
      str = str.substr(0, i) + '-' + str.substr(i);
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (isLastCharUpper && isLastLastCharUpper && (/[a-zA-Z]/).test(c) && c.toLowerCase() === c) {
      str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = c.toLowerCase() === c;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = c.toUpperCase() === c;
    }
  }

  return str;
}

exports.camelCase = function () {
  let str = Array
  .from(arguments)
  .map(x => x.trim())
  .filter(x => x.length)
  .join('-');

  if (str.length === 0) {
    return '';
  }

  if (str.length === 1) {
    return str.toLowerCase();
  }

  str = preserveCamelCase(str);

  return str
  .replace(/^[_.\- ]+/, '')
  .toLowerCase()
  .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
};
