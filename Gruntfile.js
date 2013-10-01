module.exports = function(grunt) {
        'use strict';

        var basic = [
                'src/header.js',
                'src/config.js',
                'src/resize.js',
                'src/network_renderer.js',
                'src/footer.js'
        ]

        var withLib = ['lib/biomart-network/dist/biomart_network.d3.js']

        Array.prototype.push.apply(withLib, basic)

        // Project configuration.
        grunt.initConfig({
                concat: {
                        basic: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'dist/biomart_network_renderer.js': basic,
                                        'dist/biomart_network_renderer.network.d3.js': withLib
                                }
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};