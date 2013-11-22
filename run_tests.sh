#!/bin/zsh

set -e

grunt "concat:test"
testem
rm "test/renderer.js"