var path = require('path');

// js
let es5 = /require\(['"](.*?)['"]\)/g;
let es6 = /from\s+['"](.*?)['"]/g;
// wxml
let wxml = /<import\s+src=['"](.*?)['"]\s+\/>/g;
let wxs = /<wxs\s+src=['"](.*?)['"]\s+.*?\s+\/>/g
// css
let css = /@import\s+['"](.*?)['"]/g;

let keysPattern;
let opt;
let filePath;

module.exports = function alias(options, content, _filePath) {
    opt = options = options || {};
    filePath = _filePath;
    setKeysPatten(options);
    switch (path.extname(_filePath)) {
    case '.js':
    case '.wxs':
        content = content.replace(es6, replaceCallback);
        content = content.replace(es5, replaceCallback);
        break;
    case '.wxml':
        content = content.replace(wxml, replaceCallback);
        content = content.replace(wxs, replaceCallback);
        break;
    case '.styl':
    case '.css':
    case '.wxss':
        content = content.replace(css, replaceCallback);
        break;
    }
    return content;
};

function setKeysPatten(options) {
    options = options || {};
    keysPattern = keysPattern || new RegExp('^(' + Object.keys(options).join('|') + ')');
}

function replaceCallback(match, subMatch) {
    if (keysPattern.test(subMatch)) {
        let key = subMatch;
        let pathUrl = path.join(process.cwd(), opt[key].substr(1)).replace('src', 'dist');
        return match.replace(
            subMatch,
            path.relative(filePath, pathUrl).replace(/\\/g, '/').replace(/^\.\.\//, '')
        );
    } else {
        return match;
    }
}

