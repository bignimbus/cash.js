/*eslint-disable  */
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
            "options": {
                "configFile": "eslintrc.json"
            },
            "target": ["src/*.js", "tests/*.js"]
        },
        "githooks": {
            "all": {
                "pre-commit": "eslint"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.registerTask('precommit', ['eslint', 'jasmine']);
};
