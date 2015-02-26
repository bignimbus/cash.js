module.exports = function (grunt) {
    grunt.initConfig({
        "jasmine": {
            "pivotal": {
                "src": 'src/*.js',
                "options": {
                    "specs": 'tests/*.spec.js',
                    "version": "2.1.4",
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

        }
        "githooks": {
            "all": {
                "pre-commit": "commit"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('commit', ['jasmine', 'lint']);
};