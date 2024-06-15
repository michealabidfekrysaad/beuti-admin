#!/usr/bin/env bash
echo "Start copying styles"
cp src/semantic/dist/semantic.min.css public/assets/css/styles.min.css
cp src/semantic/dist/semantic.rtl.min.css public/assets/css/styles.rtl.min.css
echo "Styles are copied to public/assets/src"
