/**
 * @fileoverview Custom rules for Salesforce DX
 * @author Thomas Stachl
 */
"use strict";

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

var SINGLETON_FILE_REGEXP = /(Controller|Renderer|Helper|Provider|Test|Model)\.js$/;

// this computes the first position after all the comments (multi-line and single-line)
// from the top of the code
function afterCommentsPosition(code) {
    var position = 0;
    var match;
    do {
        // /\*.*?\*/
        match = code.match(/^(\s*(\/\*([\s\S]*?)\*\/)?\s*)/);
        if (!match || !match[1]) {
            match = code.match(/^(\s*\/\/.*\s*)/);
        }
        if (match && match[1]) {
            position += match[1].length;
            code = code.slice(match[1].length);
        }
    } while (match);
    return position;
}

function processSingletonCode(code) {
    // transform `({...})` into `"use strict"; exports = ({...});`
    var pos = afterCommentsPosition(code);
    if (code.charAt(pos) === '(') {
        code = code.slice(0, pos) + '"use strict"; exports = ' + code.slice(pos);
        pos = code.lastIndexOf(')') + 1;
        if (code.charAt(pos) !== ';') {
            code = code.slice(0, pos) + ';' + code.slice(pos);
        }
    }
    return code;
}

function processFunctionCode(code) {
    // transform `function () {}` into `"use strict"; exports = function () {};`
    var pos = afterCommentsPosition(code);
    if (code.indexOf('function', pos) === pos) {
        code = code.slice(0, pos) + '"use strict"; exports = ' + code.slice(pos);
        pos = code.lastIndexOf('}') + 1;
        if (code.charAt(pos) !== ';') {
            code = code.slice(0, pos) + ';' + code.slice(pos);
        }
    }
    return code;
}

module.exports.rules = {
  "aura-api": {
    create: require('salesforce-lightning-cli/rules/aura-api.js')
  },
  "ecma-intrinsics": {
    create: require('salesforce-lightning-cli/rules/ecma-intrinsics.js')
  },
  "secure-document": {
    create: require('salesforce-lightning-cli/rules/secure-document.js')
  },
  "secure-window": {
    create: require('salesforce-lightning-cli/rules/secure-window.js')
  }
};

module.exports.processors = {
    ".js": {
        preprocess: function(text, filename) {
            if (SINGLETON_FILE_REGEXP.test(filename)) {
                text = processSingletonCode(text);
            } else {
                text = processFunctionCode(text);
            }
            return [text];
        },
        postprocess: function(messages) {
            return messages[0];
        }
    }
};
