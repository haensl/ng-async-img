(function() {
  'use strict';
  module.exports = function(config) {
    config.set({
      basePath: './',
      frameworks: ['jasmine'],
      exclude: [],
      reporters: ['spec'],
      specReporter: {
        suppressPassed: true
      },
      port: 9876,
      colors: true,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: false,
      concurrency: Infinity,
      usePolling: true
    });
  };
})();
