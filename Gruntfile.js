module.exports = function(grunt) {
        'use strict';

        // Project configuration.
        grunt.initConfig({
                concat: {
                        basic: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'dist/biomart_network_renderer.js': ['src/config.js', 'src/network_renderer.js'],
                                        'dist/biomart_network_renderer.network.d3.js': ['lib/biomart-network/dist/biomart_network.d3.js','src/config.js', 'src/network_renderer.js'],
                                }
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};