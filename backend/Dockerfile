FROM node:12-alpine

WORKDIR /usr/share/app
COPY . .

RUN npm install -g yarn && apk add python
RUN yarn install && yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]