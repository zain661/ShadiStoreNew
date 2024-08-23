@echo off
setlocal enabledelayedexpansion
set PUSH_IMAGES=n

REM Get ECR login and authenticate Docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 491085412067.dkr.ecr.us-east-1.amazonaws.com

REM Build Docker images
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/admin:v1 -f admin/Dockerfile admin/ && ^
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/be:v1 -f backend/Dockerfile backend/ && ^
docker build -t 491085412067.dkr.ecr.us-east-1.amazonaws.com/fe:v1 -f frontend/Dockerfile frontend/

REM Ask if the user wants to push the images
set /p PUSH_IMAGES="Do you want to push all the images to the registry? (y/n): "

if /I "%PUSH_IMAGES%"=="y" (
    REM Push the images
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/admin:v1
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/be:v1
    docker push 491085412067.dkr.ecr.us-east-1.amazonaws.com/fe:v1

    echo All images pushed successfully.
) else (
    echo Skipping the push process for all images.
)

endlocal

