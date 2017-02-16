(() => {
  const gulp = require('gulp');
  const $ = require('gulp-load-plugins')();
  const karma = require('karma');
  const root = __dirname;
  const glob = require('glob');
  const wiredep = require('wiredep');
  const del = require('del');
  const fs = require('fs');
  const join = require('path').join;
  const semver = require('semver-regex');

  const getAssets = () =>
    new Promise((resolve, reject) => {
      const assets = {};
      const patterns = {
        js: 'src/**/!(*.spec).js',
        spec: 'src/**/*.spec.js',
        img: '*.png'
      };

      Object.keys(patterns).forEach((type) => {
        glob(patterns[type], (err, files) => {
          if (err) {
            return reject(err);
          }

          if (type === 'img') {
            assets[type] = {
              included: false,
              served: true,
              pattern: files[0]
            };
          } else {
            assets[type] = files;
          }
          if (Object.keys(assets).length === Object.keys(patterns).length) {
            assets.bower = wiredep({
              directory: 'bower_components',
              dependencies: true,
              devDependencies: true
            }).js;
            resolve(assets);
          }
        });
      });
    });

  let version;
  const getVersion = () =>
    new Promise((resolve, reject) => {
      if (version) {
        return resolve(version);
      }

      try {
        const rl = require('readline').createInterface({
          input: fs.createReadStream('CHANGELOG.md')
        });

        rl.on('line', (line) => {
          if (!version) {
            version = line.match(semver()).pop();
            rl.close();
          }
        });

        rl.on('close', () => {
          if (!version) {
            version = '1.0.0';
          }

          resolve(version);
        });
      } catch (e) {
        reject(e);
      }
    });

  const startKarma = (config, done) => {
    if (!config.files) {
      throw new Error('No files specified!');
    }

    new karma.Server({
      configFile: `${root}/karma.conf.js`,
      singleRun: (typeof config.singleRun === 'boolean' ? config.singleRun : true),
      autoWatch: (typeof config.autoWatch === 'boolean' ? config.autoWatch : false),
      files: config.files
    }, (karmaResult) => {
      if (karmaResult) {
        done(`Karma: tests failed with code ${karmaResult}`);
      } else {
        done();
      }
    }).start();
  };

  gulp.task('lint', () =>
    gulp.src('src/*.js')
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError()));

  gulp.task('clean', () =>
    del(['lib/*'], {
      force: true
    }));

  gulp.task('dist', () => {
    const distFolder = join(root, '/lib');
    if (!(fs.existsSync(distFolder) && fs.statSync(distFolder).isDirectory())) {
      fs.mkdirSync(distFolder);
    }

    return getAssets().then((assets) =>
      gulp.src(assets.js)
        .pipe($.uglify())
        .pipe($.rename((path) => {
          path.basename += '.min';
          return path;
        }))
        .pipe(gulp.dest(distFolder)));
  });

  gulp.task('tdd', (done) => {
    getAssets()
      .then((assets) => {
        startKarma({
          singleRun: false,
          autoWatch: true,
          files: assets.bower.concat(assets.js, assets.img, assets.spec)
        }, done);
      });
  });

  gulp.task('test', (done) => {
    getAssets()
      .then((assets) => {
        startKarma({
          singleRun: true,
          autoWatch: false,
          files: assets.bower.concat(assets.js, assets.img, assets.spec)
        }, done);
      });
  });

  gulp.task('updateVersion', (done) => {
    getVersion()
      .then((ver) => {
        gulp.src('package.json')
          .pipe($.bump({
            version: ver
          }))
          .pipe(gulp.dest(root));
        done();
      });
  });

  gulp.task('build', (done) => {
    require('run-sequence')('test', 'lint', 'updateVersion', 'clean', 'dist', done);
  });
})();
