FROM node:16-alpine3.18
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . /app/
RUN yarn build
