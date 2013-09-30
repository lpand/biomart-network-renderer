module.exports = function(grunt) {
        'use strict';

        // Project configuration.
        grunt.initConfig({
                concat: {
                        options: {
                                separator: "\n",
                        },
                        dist: {
                                src: ['src/config.js', 'src/network_renderer.js'],
                                dest: 'dist/network_renderer.js'
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};