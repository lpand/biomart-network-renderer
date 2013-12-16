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
        "src/table.js",
        "src/foci_draw.js",
        "src/plain_draw.js",
        "src/renderer.js",
        'src/network_renderer.js',
        "src/enrichment_renderer.js"
    ]

    var basic = ['src/header.js'].concat(core, ['src/footer.js'])
    var deps = ['lib/lodash.js', 'src/header.js'].concat(core, ['src/footer.js'])

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
            }
        }
    })


    grunt.loadNpmTasks('grunt-contrib-concat');
};