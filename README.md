# eslint-plugin-sfdx

Custom rules for Salesforce DX

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-sfdx`:

```
$ npm install eslint-plugin-sfdx --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-sfdx` globally.

## Usage

Add `sfdx` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "sfdx"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ecma-intrinsics": 1,
        "secure-document": 1,
        "aura-api": 1,
        "secure-window": 1
    }
}
```

## License

The [Salesforce Developer MSA](http://www.sfdcstatic.com/assets/pdf/misc/salesforce_Developer_MSA.pdf) governs your use of the Lightning CLI.
