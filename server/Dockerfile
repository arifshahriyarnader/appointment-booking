FROM node:20.17-slim

WORKDIR /code

ADD package.json .
ADD package-lock.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]

