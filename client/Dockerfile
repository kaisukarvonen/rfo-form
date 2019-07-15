FROM node:latest as client

WORKDIR /usr/src
COPY package.json /usr/src/package.json

RUN npm install
RUN npm install react-scripts
COPY react-html-email/ /usr/src/node_modules/react-html-email

EXPOSE 80
CMD ["npm","start"]
