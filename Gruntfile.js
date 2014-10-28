module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({
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
          'BrowserDetector.js'
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
        src: 'HnBrowserDetector.js',
        dest: 'HnBrowserDetector.min.js'
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-dev-update');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
