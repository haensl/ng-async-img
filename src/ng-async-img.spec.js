(function() {
  'use strict';
  describe('ng-async-img directive', function() {
    var $rootScope;
    var $q;
    var $animate;
    var $document;
    var compileDirective;

    beforeEach(angular.mock.module('ngAnimate', 'ngAnimateMock', 'ngAsyncImg'));
    beforeEach(angular.mock.inject(function(_$rootScope_, _$animate_, _$q_, $compile, $timeout) {
      $rootScope = _$rootScope_;
      $animate = _$animate_;
      $q = _$q_;
      $animate.enabled(true);
      $document = angular.element(document.body);
      compileDirective = function(scope, attrs) {
        var e = angular.element('<async-img src="base/src/test.png" class="test" an-attribute="1"></async-img>');
        if (attrs) {
          Object.keys(attrs).forEach(function(attrName) {
            e.attr(attrName, attrs[attrName]);
          });
        }

        $document.append(e);
        e[0].onclick = angular.noop;
        if (scope) {
          $compile(e)(scope);
        } else {
          $compile(e)($rootScope.$new());
        }

        $rootScope.$digest();
        $timeout.flush();
        return e;
      };
    }));

    beforeEach(function() {
      spyOn($animate, 'enter').and.callFake(function(element, parent, after) {
        var deferred = $q.defer();
        try {
          if (after) {
            angular.element(after).after(element);
          } else {
            parent.append(element);
          }
          deferred.resolve();
        } catch (e) {
          deferred.reject(e);
        }

        return deferred.promise;
      });
    });

    describe('When an async image is linked', function() {
      beforeEach(function(done) {
        compileDirective();
        // Nothing else seems to work for now.
        // Already tried:
        // - $timeout.flush()
        // - $animate.flush()
        // - $animate.closeAndFlush();
        setTimeout(function() {
          $rootScope.$digest();
          done();
        }, 100);
      });

      afterEach(function() {
        Array.prototype.forEach.call($document.find('img'), function(e) {
          angular.element(e).remove();
        });
        Array.prototype.forEach.call($document.find('async-img'), function(e) {
          angular.element(e).remove();
        });
      });

      it('should trigger an enter animation', function() {
        expect($animate.enter).toHaveBeenCalled();
      });

      it('should replace the element with the image', function() {
        expect($document.find('img').length).toBe(1);
      });

      it('should add the `test` class to the img', function() {
        expect(angular.element($document.find('img')[0]).hasClass('test')).toBe(true);
      });

      it('should add the `async-img` class to the img', function() {
        expect(angular.element($document.find('img')[0]).hasClass('test')).toBe(true);
      });

      it('should add set the attribute `an-attribute` to "1"', function() {
        expect(angular.element($document.find('img')[0]).attr('an-attribute')).toBe('1');
      });
    });

    describe('when an async img is passed event handlers', function() {
      var directiveScope;
      beforeEach(function(done) {
        directiveScope = $rootScope.$new();
        directiveScope.onLoad = angular.noop;
        directiveScope.onEnter = angular.noop;
        spyOn(directiveScope, 'onEnter');
        spyOn(directiveScope, 'onLoad');
        compileDirective(directiveScope, {
          'on-enter': 'onEnter()',
          'on-load': 'onLoad()'
        });
        // Nothing else seems to work for now.
        // Already tried:
        // - $timeout.flush()
        // - $animate.flush()
        // - $animate.closeAndFlush();
        setTimeout(function() {
          $rootScope.$digest();
          done();
        }, 100);
      });

      it('should call the on load callback', function() {
        expect(directiveScope.onLoad).toHaveBeenCalled();
      });

      it('should call the after enter callback', function() {
        expect(directiveScope.onEnter).toHaveBeenCalled();
      });
    });
  });
})();
