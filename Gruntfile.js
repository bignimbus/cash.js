module.exports = function (grunt) {
    grunt.initConfig({
        "jasmine": {
            "pivotal": {
                "src": 'src/*.js',
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
                "configFile": "eslintrc.json"
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
                "sourceMap": true
            },
            "dist": {
                "files": {
                    "build/cash.js": "src/main.js"
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('precommit', ['eslint', 'jasmine', 'babel']);
};
