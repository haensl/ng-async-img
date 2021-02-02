# DEPRECATED: ngAsyncImg

An angular.js directive for **asynchronous, $animate-aware** image tags.

## Deprecation notice

Due to the [end of life of Angular.js](https://blog.angular.io/stable-angularjs-and-long-term-support-7e077635ee9c), this module is deprecated and no longer maintained.

[![NPM](https://nodei.co/npm/ng-async-img.png?downloads=true)](https://nodei.co/npm/ng-async-img/)

[![npm version](https://badge.fury.io/js/ng-async-img.svg)](http://badge.fury.io/js/ng-async-img)
[![Bower version](https://badge.fury.io/bo/ng-async-img.svg)](https://badge.fury.io/bo/ng-async-img)
[![Build Status](https://travis-ci.org/haensl/ng-async-img.svg?branch=master)](https://travis-ci.org/haensl/ng-async-img)

## Installation

1. Install the `ngAsyncImg` package

    via **NPM**
    ```bash
    npm install ng-async-img --save
    ```

    or via **BOWER**
    ```
    bower install ng-async-img --save
    ```

2. Include the library into your application:
    
    if installed via **NPM** include from `node_modules`
    ```javascript
    <script src="/node_modules/ng-async-img/lib/ng-async-img.min.js"></script>
    ```

    if installed via **Bower** include from `bower_components`
    ```javascript
    <script src="/bower_components/ng-async-img/lib/ng-async-img.min.js"></script>
    ```

## Usage

1. Add a dependency to `ngAsyncImg` to your app
```javascript
angular.module('myApp', ['ngAsyncImg']);
```

2. Use the `async-img` directive in your markup
```html
<async-img src="/path/to/your/img.png"></async-img>
```

## Features

* The image will then be loaded asynchronously and the `<async-img>`-tag replaced by a regular `<img>`-tag when the image has loaded. This is done via [`$animate.enter()`](https://docs.angularjs.org/api/ng/service/$animate#enter) which enables CSS-animation via `.ng-enter`.

* As of *version 1.2.0* `<async-img>` can be passed `onLoad()` and `onEnter()` callback functions.

* The `<async-img>` will retain all attributes of the initial `<async-img>` and have the `.async-img` class.

### Example: CSS animation to fade in async images

In your markup:
```html
<!-- ... -->
<async-img src="/path/to/your/img.png"
  class="some-class"
  an-attribute="1"></async>
<!-- ... -->
```

In your stylesheets:
```css
/**
 * Fade-in asynchronously loaded images
 */
.async-img {
  transition: opacity 0.4s ease-in-out;
}

.async-img.ng-enter {
  opacity: 0;
}

.async-img.ng-enter-active {
  opacity: 1;
}

.async-img.ng-enter-prepare {
  opacity: 0;
}
```

Markup after the `<async-img>` has finished loading:
```html
<img src="/path/to/your/img.png"
  class="some-class async-img"
  an-attribute="1" />
```

### Example: `onLoad()` and `onEnter()` callbacks *(requires version >= 1.2.0)*
In your controller:
```javascript
//...
scope.onAsyncImgLoad = function() {
  // code
};

scope.onAsyncImgEnter = function() {
  // code
};
```

In your markup:
```html
<async-img src="/path/to/your/img.png"
  on-load="onAsyncImgLoad()"
  on-enter="onAsyncImgEnter()"></async-img>
```

## [Changelog](CHANGELO.md)

## [License](LICENSE)
