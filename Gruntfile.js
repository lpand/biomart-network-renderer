module.exports = function(grunt) {
        'use strict';

        var core = [
                'src/config.js',
                'src/table.js',
                'src/text.js',
                'src/force.js',
                'src/graph_chart.js',
                'src/graph.js',
                'src/cluster.js',
                'src/resize.js',
                'src/network_renderer.js'
        ]

        var basic = ['src/header.js'].concat(core, ['src/footer.js'])
        var deps = ['lib/lodash.js', 'src/header.js'].concat(core, ['src/footer.js'])
        var test = core

        // Project configuration.
        grunt.initConfig({
                concat: {
                        basic: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'dist/biomart_enrichment_renderer.js': basic
                                }
                        },
                        test: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'test/biomart_enrichment_renderer.js': test
                                }
                        },
                        deps: {
                                options: {
                                        separator: "\n",
                                },
                                files: {
                                        'dist/biomart_enrichment_renderer.deps.js': deps
                                }
                        }
                }
        })


        grunt.loadNpmTasks('grunt-contrib-concat');
};