#!/bin/bash
# Cloudflare Pages build script - exclude .git
mkdir -p dist
cp -r *.html css js assets dist/
cp -r 组卷增加筛选功能PRD需求 dist/ 2>/dev/null || true
