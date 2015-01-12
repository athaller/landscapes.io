#!/bin/bash
#
# Jenkins script to deploy this build
#
# Requires 2 arguments, $1 = subnet prefix (ex 10.10), $2 = docker hub password, $3 - is optional is the Feature service URL, otherwise the script will search
#

TAG_NAME="DeployGroup"
TAG_VALUE="landscapes"
REGISTRY="openwhere"
SUBNET_PREFIX="$1"
PASSWORD="$2"

host_string=$(aws ec2 describe-instances --region us-east-1 --output text --filter Name=instance-state-name,Values=running Name=tag-key,Values=${TAG_NAME} Name=tag-value,Values=${TAG_VALUE} | grep PRIVATEIPADDRESS| grep ${SUBNET_PREFIX} | awk '{printf "%s ", $3;}'  )
hosts=($host_string)

if [ -z "$3" ]
  then
    DOCKER_TAG="latest"
else
    DOCKER_TAG="$3"
fi

echo "Found following hosts to update: ${host_string}"

for var in "${hosts[@]}"
do
    echo "Deploying to ${var}..."
    ssh -tt ec2-user@${var} "docker stop ${TAG_VALUE} || true; docker rm ${TAG_VALUE} || true; docker images -q --filter \"dangling=true\" | xargs docker rmi; docker login -u openwhere -p ${PASSWORD} -e devops@openwhere.com; docker pull ${REGISTRY}/${TAG_VALUE}:${DOCKER_TAG} && /var/lib/cloud/scripts/docker-run.sh"
done
