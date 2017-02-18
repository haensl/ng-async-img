(function(angular) {
  angular.module('ngAsyncImg', [])
    .directive('asyncImg', [
      '$animate',
      function($animate) {
        return {
          restrict: 'E',
          scope: {
            onLoad: '&',
            onEnter: '&'
          },
          link: function(scope, element, attributes) {
            element.addClass('async-img');
            if ('src' in attributes) {
              var img = new Image();
              Array.prototype.forEach.call(element[0].classList, function(className) {
                img.classList.add(className);
              });
              Array.prototype.forEach.call(element[0].attributes, function(node) {
                img.setAttribute(node.nodeName, node.nodeValue);
              });
              img.onload = function() {
                if (typeof scope.onLoad === 'function') {
                  scope.onLoad();
                }

                scope.$apply(function() {
                  $animate.enter(img, element.parent(), element[0].previousElementSibling)
                    .then(function() {
                      if (typeof scope.onEnter === 'function') {
                        scope.onEnter();
                      }
                    });
                  element.remove();
                });
              };
              img.src = attributes.src;
            }
          }
        };
      }
    ]);
})(window.angular);
