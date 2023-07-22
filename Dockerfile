FROM node:19-slim

RUN apt-get update && apt-get install -y procps

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]