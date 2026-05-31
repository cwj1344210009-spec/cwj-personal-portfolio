#!/bin/bash
# Cloudflare Pages build script - exclude .git
mkdir -p dist
cp -r *.html css js assets dist/
