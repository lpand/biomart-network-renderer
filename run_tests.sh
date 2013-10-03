#!/bin/zsh

set -e

grunt "concat:test"
testem
rm "test/biomart_network_renderer.js"