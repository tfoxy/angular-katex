# angular-katex

[![npm version](http://img.shields.io/npm/v/angular-katex.svg)](https://npmjs.org/package/angular-katex) ![bower version](https://img.shields.io/bower/v/angular-katex.svg) [![build status](https://img.shields.io/travis/tfoxy/angular-katex.svg)](https://travis-ci.org/tfoxy/angular-katex)

Display math with KaTex and AngularJS.


## Requirements

  - [AngularJS](https://github.com/angular/angular.js)
  - [KaTeX](https://github.com/Khan/KaTeX)


## Load into your app

You can get it from [Bower](http://bower.io/)

```sh
bower install angular-katex
```

or [npm](http://npmjs.com/)

```sh
npm install angular-katex
```

Load the script files in your application:

```html
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/katex/dist/katex.min.js"></script>
<script type="text/javascript" src="bower_components/angular-katex/angular-katex.js"></script>
```

Add the specific module to your dependencies:

```javascript
angular.module('myApp', ['katex', ...])
```


## Usage examples

[Live demo](http://jsbin.com/bidici/embed?html,output)

```html
<!-- Tag element -->
<katex>x^2</katex>

<!-- Attribute -->
<div katex>x^2</div>

<!-- Attribute value -->
<div katex="x^2"></div>

<!-- Bind to scope
  $scope.tex = {pow: 'x^2'}
  -->
<div katex-bind="tex.pow"></div>

<!-- Set options (Display mode) -->
<div katex="x^2" katex-options="{displayMode: true}"></div>

<!-- Set error handler -->
<!-- katex-on-error locals:
  $expr: (string) expression
  $err: (object) error
  $setText: (function) set element text -->
<div katex="\" katex-on-error="$setText('Bad Expression: ' + $expr + ' . ' + $err)"></div>
```


## Configuration

`katexConfigProvider` have the following properties:
  
  - `defaultOptions`: object that is passed to the `katex.render` function as the options parameter.
  By default, it is `{}`.
  - `errorHandler`: function that is called when there is an error while parsing the expression.
  It has three parameters: `error`, `expression`, `element`.
  It does not get called if `katexOnError` directive is used.
  By default, it appends a span element with the error message and the `katex-error` class: `<span class="katex-error">Error: message</span>`.
  This function can be used to use MathJax as a fallback.
