# docker-example
A docker-containerized web app that identifies offensive speech.

## Getting Started

Run frontend docker container

    docker run \                 
    -itd \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3001:3000 \
    -e CHOKIDAR_USEPOLLING=true \
    ml-frontend

Run backend docker container

    docker run -p 8000:8000 -d ml-backend


## Docker

### Terminology

- Images: base vs. child images, official vs. user images
  - User images are formatted as user/image-name
- Containers: created from Docker images and run the actual application
- Docker Daemon: background service running on the host that manages building, running and distributing Docker containers
- Docker Client:
- Docker Hub: a registry of Docker images

### Docker CLI

See all containers

    docker ps -a

See all images

    docker images

See docker network

    docker network ls
    docker network inspect bridge

Build an image at current working dir

    docker image build -t <image_name> .

    -f: provide the file path to Dockerfile

Run a container

    docker run -p <HOST_PORT>:<CONTAINER_PORT> -d <image_name>

    --rm: automatically removes the container when it exits
    -d: detached mode
    -p: specify custom port
    -P: publish all exposed ports to random ports
    --name: corresponds to a name we want to give
    --net: launch container inside a network

Restart Mode

    --restart always: cannot be stopped even with `docker stop` command
    --restart unless-stopped

See docker port(s):

    docker port [CONTAINER]

Stop a container

    docker stop [CONTAINER]
    
To delete all containers

    docker rm -f $(docker images -a -q)
    docker rm $(docker ps -a -q -f status=exited)

    -q: only returns numeric IDs
    -f: filters output based on conditions provided

    docker container prune

To delete all containers including its volume use

    docker rm -vf $(docker ps -a -q)

To delete all images

    docker rmi -f $(docker images -a -q)

To search for images

    docker search

To create a network

    docker network create <network_name> -> Creates a new bridge network

    -> On user defined networks, containers can not only communicate by IP address, but can also resolve a container name to an IP address.

Storage

    VOLUME /path/to/directory

    /path/to/directory is a path to a directory used inside the image
    docker run -v is used to map this directory to an actualy volume on the host system


EXPOSE instruction

    Only for documentation purposes


Monitoring

    docker stats


Disk Space Consumption

1. Stopped containers that were not removed by using the --rm switch on the docker run command or using the docker rm command once they are stopped.
2. Unused images: images that are not referenced by other images or containers.
3. Dangling images: images that have no name. This happens when you docker build an image with the same tag as before, the new one replaces it and the old one becomes dangling.
4. Unused volumes.


Reclaiming Disk Space
    
    docker container prune -f
    docker volume prune -f
    docker image prune -f


Remove all unused images

    docker image prune --all


### [Dockerfile](https://docs.docker.com/engine/reference/builder/)

FROM: specify base image
WORKDIR: set working directory
COPY/ADD:

RUN

EXPOSE: specify port number that needs to be exposed
CMD []:

1. Java

    # Use an image with the SDK for compilation
    FROM openjdk:8-jdk-alpine AS builder
    WORKDIR /out
    # Get the source code inside the image 
    COPY *.java .
    # Compile source code
    RUN javac Hello.java

    # Create a lightweight image 
    FROM openjdk:8-jre-alpine
    # Copy compiled artifacts from previous image
    COPY --from=builder /out/*.class .
    CMD ["java", "Hello"]

2. Node.js

    FROM node:10-alpine
    # Create app directory
    RUN mkdir -p /usr/src/app
    WORKDIR /usr/src/app

    # Install app dependencies
    COPY package.json /usr/src/app/
    RUN npm install

    WORKDIR /usr/src/app

    # Bundle app source
    COPY . /usr/src/app/

    EXPOSE 80

    CMD ["npm", "start"]


3. Python

    FROM python:3.7-stretch

    # Install modules
    RUN pip install Flask

    # Needed by the Flask module
    ENV FLASK_APP=server.py

    # Copy source files into the image
    COPY templates ./templates
    COPY server.py .

    EXPOSE 5000

    CMD ["flask", "run", "--host=0.0.0.0"]

### Registry

Publish an image

1. Build Image (docker build)

    docker tag <image_name> <docker_user/image_name>: name image correctly before pushing to the Registry

2. Log into the Registry (docker login)
3. Push image into the Registry (docker push)

    docker login
    docker push <docker_user/image_name>

#### Private Registry

1. Docker Hub
2. Azure Container Registry
3. Gitlab
4. Registry image allows you to host your own registry on a Docker enabled machine as a container
   

### Image Size Best Practices

1. Files included in image
   - Use multiple COPY instructions
   - Use .dockerignore file
2. Base image size
3. Image layers


### Other open-source tools

1. Docker Machine - Create Docker hosts on your computer, on cloud providers, and inside your own data center
2. Docker Compose - A tool for defining and running multi-container Docker applications.
3. Docker Swarm - A native clustering solution for Docker
4. Kubernetes - Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.

### Docker on AWS

Docker push: publish image on a registry which can be accessed by AWS

AWS Elastic Beanstalk