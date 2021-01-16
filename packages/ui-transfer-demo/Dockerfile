FROM node:10-alpine

LABEL org.opencontainers.image.source https://github.com/digita-ai/ui-transfer

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm ci

# Bundle app source
COPY . /usr/src/app

RUN rm -f /usr/src/app/.npmrc
RUN npm run build

# Expose ports.
EXPOSE 80
CMD npm run start
