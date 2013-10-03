module.exports = function(grunt) {
        'use strict';

        var core = [
                'src/config.js',
                'src/graph.js',
                'src/resize.js',
                'src/network_renderer.js'
        ]

        var basic = [
                'lib/biomart-network/dist/biomart_network.js',
                'src/header.js',
        ].concat(core, ['src/footer.js'])

        var test = [
                'lib/biomart-network/dist/biomart_network.js',
                'src/header.js', 'test/*.js'
        ].concat(core, ['src/footer.js'])

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
                                        'dist/biomart_network_renderer.js': basic
                                }
                        },
                        test: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'test/biomart_network_renderer.js': basic
                                }
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};