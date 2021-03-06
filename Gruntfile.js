/*global module:false*/
module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
          'package.json',
          'bower.json',
          'dist/HnBrowserDetector.min.js'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    devUpdate: {
      show: {
        options: {
          updateType: 'report',
          reportUpdated: true,
          packages: {
            devDependencies: true,
            dependencies: true
          },
          packageJson: null
        }
      },
      install: {
        options: {
          updateType: 'force',
          reportUpdated: false,
          semver: false,
          packages: {
            devDependencies: true,
            dependencies: false
          },
          packageJson: null
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: [
          'src/BrowserDetector.js'
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*!\n' +
        ' * <%= pkg.name %> - <%= grunt.template.today("yyyy") %> \n' +
        ' * Version <%= pkg.version %>\n' +
        ' */\n',
        report: 'min'
      },
      Detection: {
        src: 'src/BrowserDetector.js',
        dest: 'dist/HnBrowserDetector.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-dev-update');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
