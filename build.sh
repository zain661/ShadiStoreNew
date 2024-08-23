#!/bin/bash
set -ex
aws ecr get-login-password --region us-east-1 --profile s | docker login --username AWS --password-stdin 491085412067.dkr.ecr.us-east-1.amazonaws.com
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/admin:v1 -f admin/Dockerfile admin/ && \
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/be:v1 -f backend/Dockerfile backend/ && \
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/fe:v1 -f frontend/Dockerfile frontend/ && \


# Ask if the user wants to push the images
read -p "Do you want to push all the images to the registry? (y/n): " PUSH_IMAGES

if [ "$PUSH_IMAGES" = "y" ] || [ "$PUSH_IMAGES" = "Y" ]; then
    # Push the images
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/admin:v1
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/be:v1
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/fe:v1

    echo "All images pushed successfully."
else
    echo "Skipping the push process for all images."
fi
