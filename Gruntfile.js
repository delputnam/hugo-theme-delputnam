module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/js/jquery-1.11.3.min.js','src/js/bootstrap.min.js','src/js/instaclick.min.js','src/js/app.js'],
                dest: 'static/js/app.js',
            },
        },
        compass: {
            clean: {
                options: {
                    require: [
                        'compass/import-once/activate',
                        'bootstrap-sass',
                        'font-awesome-sass'
                    ],
                    sassDir: 'src/sass',
                    cssDir: 'static/css',
                    fontsDir: 'fonts',
                    fontsPath: 'static/fonts',
                    outputStyle: 'compressed',
                    environment: 'production',
                    raw: 'preferred_syntax = :sass\n',
                    clean: true,
                },
            },
            dist: {
                options: {
                    require: [
                        'compass/import-once/activate',
                        'bootstrap-sass',
                        'font-awesome-sass'
                    ],
                    sassDir: 'src/sass',
                    cssDir: 'static/css',
                    fontsDir: 'fonts',
                    fontsPath: 'static/fonts',
                    outputStyle: 'compressed',
                    environment: 'production',
                    raw: 'preferred_syntax = :sass\n'
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', ['compass', 'concat']);
};
