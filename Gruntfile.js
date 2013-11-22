module.exports = function(grunt) {
    'use strict';

    var core = [
        'src/config.js',
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
    var test = [
        'src/renderer.js'
    ]

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
                    'test/renderer.js': test
                }
            },
            deps: {
                options: {
                    separator: "\n",
                },
                files: {
                    'dist/biomart_network_renderer.deps.js': deps
                }
            }
        }
    })


    grunt.loadNpmTasks('grunt-contrib-concat');
};