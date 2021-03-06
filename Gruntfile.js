module.exports = function (grunt) {
    grunt.initConfig({
        "jasmine": {
            "pivotal": {
                "src": 'dist/cash.js',
                "options": {
                    "specs": 'tests/*.spec.js',
                    "version": '2.1.4',
                    "vendor": [
                        'bower_components/jquery/dist/jquery.js'
                    ],
                    "keepRunner": true
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
                    "es5-amd/cash-dom.js": "src/cash-dom.js",
                    "es5-amd/cash-main.js": "src/cash-main.js",
                    "es5-amd/cashex.js": "src/cashex.js",
                    "es5-amd/register.js": "src/register.js",
                    "es5-amd/polyfills.js": "src/polyfills.js",
                    "es5-amd/currencies.js": "src/currencies.js"
                }
            }
        },
        "requirejs": {
            "main": {
                "options": {
                    'findNestedDependencies': true,
                    'baseUrl': 'es5-amd',
                    'optimize': 'none',
                    'include': ['cash-dom.amd.js'],
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
            },
            "lite": {
                "options": {
                    'findNestedDependencies': true,
                    'baseUrl': 'es5-amd',
                    'optimize': 'none',
                    'include': ['cash-lite.amd.js'],
                    'out': 'dist/cash-lite.js',
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
                    "src": ['es5-amd/', 'dist/']
                }
            }
        },
        "uglify": {
            "js": {
                "files": {
                    'dist/cash-lite.min.js': ['dist/cash-lite.js'],
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
    grunt.loadNpmTasks('grunt-git');
    grunt.registerTask('build', ['babel', 'requirejs:main', 'requirejs:lite', 'uglify']);
    grunt.registerTask('test', ['build', 'jasmine']);
    grunt.registerTask('precommit', ['eslint', 'test', 'gitadd']);
};
