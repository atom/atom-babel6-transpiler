# atom-babel6-transpiler

This project implements an [Atom package transpiler]() that transpiles your package's files with Babel 6.

## Use

First, install the package and its peer dependency, babel-core, from the npm registry:

    npm install --save atom-babel6-transpiler babel-core

Next, modify your `package.json` to include a reference to the transpiler for any files you want Babel to process as described [in the Atom Flight Manual](). For example, to process every file ending in `.js` in your package, you could use:

```javascript
{
  ...
  "atomTranspilers": [
    {
      "glob": "**/*.js",
      "transpiler": "atom-babel6-transpiler"
    }
  ]
}
```

Finally, install Babel and all the presets and plugins you want to use as normal. For a simple example, if you wanted to use the ES2015 and React presets, you might run:

    npm install --save babel-preset-es2015 babel-preset-react

and then create a [`.babelrc` file](http://babeljs.io/docs/usage/babelrc/) to configure Babel to use them:

```javascript
{
  "presets": ["es2015", "react"]
}
```

You may also specify options in your `package.json` inside the optional `options` object; the subkey `babel`, if it exists, will be passed [as options to `babel.transform`](http://babeljs.io/docs/usage/api/#babeltransformcode-optionsdocsusageoptions).

```javascript
{
  ...
  "atomTranspilers": [
    {
      "glob": "**/*.js",
      "transpiler": "atom-babel6-transpiler",
      "options": {
        "babel": {
          "presets": ["es2015", "react"]
        }
      }
    }
  ]
}
```

## Source Maps

To enable source maps within Atom, set the Babel `sourceMaps` option to `"inline"` in your Babel configuration.

## Babel Environment

Babel supports [an option called `env`](https://babeljs.io/docs/usage/babelrc/#env-option) that allows you to configure Babel on a per-environment basis. The Babel environment is controlled via an environment variable called `BABEL_ENV`; this module automatically sets the environment variable to `"development"` if Atom is in dev mode (`atom.inDevMode()` returns `true`) and `"production"` otherwise.
