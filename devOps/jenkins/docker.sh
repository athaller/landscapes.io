#!/bin/bash
#
# Jenkins script to build a docker image for this project and upload to the docker registry
#

REGISTRY="openwhere"

if [ -z "$1" ]
  then
    TAG="latest"
else
    TAG=$1
fi

docker pull $REGISTRY/mean-base
docker build -t landscapes .
docker tag landscapes $REGISTRY/landscapes:${TAG}
docker push $REGISTRY/landscapes:${TAG}
