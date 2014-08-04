module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['*.js']
        },
        qunit: {
            all: ['gases_tests.html', 'circleCollection_tests.html']
        },
        watch: {
            files: ['**/*', '!**/node_modules/**'],
            tasks: 'default'
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['jshint', 'qunit']);

};