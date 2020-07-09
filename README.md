# docker-example
A docker-containerized web app that identifies offensive speech.

## Docker

See all containers

    docker ps -a

See all images

    docker images

Build an image at current working dir

    docker image build -t <image_name> .

Run a container

    docker run -p <HOST_PORT>:<CONTAINER_PORT> -d <image_name>

To delete all containers

    docker rmi -f $(docker images -a -q)

To delete all containers including its volume use

    docker rm -vf $(docker ps -a -q)

To delete all images

    docker rmi -f $(docker images -a -q)
