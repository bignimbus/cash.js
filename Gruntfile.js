module.exports = function (grunt) {
    grunt.initConfig({
        "jasmine": {
            "pivotal": {
                "src": 'dist/cash.js',
                "options": {
                    "specs": 'tests/*.spec.js',
                    "version": '2.1.4',
                    "vendor": 'bower_components/jquery/dist/jquery.js',
                    "template": require('grunt-template-jasmine-requirejs')
                }
            }
        },
        "eslint": {
            "options": {
                "configFile": ".eslintrc"
            },
            "target": ["src/*.js", "tests/*.js"]
        },
        "githooks": {
            "all": {
                "pre-commit": "precommit"
            }
        },
        "babel": {
            "options": {
                "sourceMap": false,
                "modules": "amd",
                "code": true
            },
            "dist": {
                "files": {
                    "build/main.js": "src/main.js",
                    "build/money-finder.js": "src/money-finder.js",
                    "build/cash-strap.js": "src/cash-strap.js",
                    "build/defaults.js": "src/defaults.js",
                    "build/regex-builder.js": "src/regex-builder.js"
                }
            }
        },
        "requirejs": {
            "js": {
                "options": {
                    'findNestedDependencies': true,
                    'baseUrl': 'build',
                    'optimize': 'none',
                    'include': ['cash-amd.js'],
                    'out': 'dist/cash.js',
                    'onModuleBundleComplete': function (data) {
                        var fs = require('fs'),
                        amdclean = require('amdclean'),
                        outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            'filePath': outputFile
                        }));
                    }
                }
            }
        },
        "gitadd": {
            "task": {
                "options": {
                    "force": true
                },
                "files": {
                    "src": ['build/cash.js', 'dist/cash.min.js']
                }
            }
        },
        "uglify": {
            "js": {
                "files": {
                    'dist/cash.min.js': ['dist/cash.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-git');
    grunt.registerTask('build', ['babel', 'requirejs:js', 'uglify']);
    grunt.registerTask('test', ['build', 'jasmine']);
    grunt.registerTask('precommit', [/*'eslint', */ 'jasmine', 'babel', 'requirejs:js', 'uglify', 'gitadd']);
};
