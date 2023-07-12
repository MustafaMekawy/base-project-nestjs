FROM node:18.12.1-alpine

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@9.5.0

RUN npm install --force

RUN npm install -g prisma

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD [ "npm", "start" ]
