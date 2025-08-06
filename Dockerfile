FROM node:12

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --only=prod

COPY ./dist ./dist

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]