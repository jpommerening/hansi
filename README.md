# hansi

Streaming ANSI escape sequence parser and HTML generator.

## Install

If you're working in nodejs:

```console
$ npm install hansi
npm http GET https://registry.npmjs.org/hansi
npm http 200 https://registry.npmjs.org/hansi
npm http GET https://registry.npmjs.org/hansi/-/hansi-0.1.0.tgz
npm http 200 https://registry.npmjs.org/hansi/-/hansi-0.1.0.tgz
hansi@0.1.0 node_modules/hansi
```

You can fetch hansi with Bower as well:

```console
$ bower install hansi
```

## Usage

Nodejs:

```js
var hansi = require('hansi');
var stream = new hansi.Stream();

stream.pipe(process.stdout);
process.stdin.pipe(stream);
```

RequireJS:

```js
require(['hansi', 'jquery'], function(hansi, $) {
  var stream = new hansi.Stream();
});
```

Globals:

```js
(function(hansi) {
  var stream = new hansi.Stream();
})(window.hansi);
```
