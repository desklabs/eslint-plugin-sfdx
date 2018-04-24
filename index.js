/**
 * @fileoverview Custom rules for Salesforce DX
 * @author Thomas Stachl
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var objectAssign = require('object-assign');
var defaultConfig = require('salesforce-lightning-cli/lib/config');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

var SINGLETON_FILE_REGEXP = /(Controller|Renderer|Helper|Provider|Test|Model)\.js$/;
var config = {};
objectAssign(config, defaultConfig);
config.rules = objectAssign({}, defaultConfig.rules);

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

config.processors = {
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
}

// import all rules in lib/rules
module.exports = config;
