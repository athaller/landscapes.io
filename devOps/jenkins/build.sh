#!/bin/bash
#
# Jenkins script to build this project

npm install --production --unsafe-perm
bower install  --config.interactive=false
