FROM node:12-alpine

WORKDIR /usr/share/app
COPY . .

RUN npm install -g yarn
RUN yarn install
RUN yarn build


FROM nginx:1.15.10
WORKDIR /usr/share/nginx/html
COPY --from=0 /usr/share/app/www .
