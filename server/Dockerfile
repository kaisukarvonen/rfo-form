FROM node:latest

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin:$PATH

RUN npm install --global nodemon

ADD package.json /usr/src/package.json
RUN npm install
RUN npm install babel-cli

EXPOSE 3001

CMD ["npm","start"]
