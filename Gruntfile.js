module.exports = function (grunt) {
    grunt.initConfig({
        "jasmine": {
            "pivotal": {
                "src": 'build/cash.js',
                "options": {
                    "specs": 'tests/*.spec.js',
                    "version": '2.1.4',
                    "template": require('grunt-template-jasmine-requirejs')
                }
            }
        },
        "uglify": {
            "js": {
                // "files": {
                //     'target': ['source']
                // }
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
                    "build/cash-modules.js": "src/main.js"
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
                    'out': 'build/cash.js',
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
                    'dist/cash.min.js': ['build/cash.js']
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
    grunt.registerTask('precommit', [/*'eslint', */ 'jasmine', 'babel', 'requirejs:js', 'uglify', 'gitadd']);
};
